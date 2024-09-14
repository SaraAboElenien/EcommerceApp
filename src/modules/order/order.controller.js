import orderModel from '../../../db/models/order.model.js';
import { asyncHandler } from '../../../utils/globleErrorHandling.js';
import { AppError } from '../../../utils/classError.js';
import productModel from '../../../db/models/product.model.js';
import couponModel from '../../../db/models/coupon.model.js'
import cartModel from '../../../db/models/cart.model.js'
import { createInvoice } from '../../../utils/pdf.js'
import { sendEmail } from '../../../service/sendEmail.js';
import Stripe from 'stripe';
import { payment } from '../../../utils/payment.js';

//========== createOrder ===========//
export const createOrder = asyncHandler(async (req, res, next) => {
    const { productId, quantity, couponCode, paymentMethod, address, phone } = req.body;

    if (couponCode) {
        const coupon = await couponModel.findOne({
            code: couponCode.toLowerCase(),
            usedBy: { $nin: [req.user._id] },
        });

        if (!coupon || coupon.toDate < Date.now()) {
            return next(new AppError("Invalid coupon code, or coupon already used or expired", 404));
        }

        req.body.coupon = coupon;
    }

    let products = [];
    let isCartOrder = false;

    if (productId) {
        products = [{ productId, quantity }];
    } else {
        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart || !cart.products.length) {
            return next(new AppError("Your cart is empty. Please select a product to order!", 404));
        }
        products = cart.products;
        isCartOrder = true;
    }

    let finalProducts = [];
    let subPrice = 0;

    for (let product of products) {
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity },
        });

        if (!checkProduct) {
            return next(new AppError("This product is out of stock!", 404));
        }

        if (isCartOrder) {
            product = product.toObject();
        }

        product.title = checkProduct.title;
        product.price = checkProduct.price;
        product.finalPrice = checkProduct.price * product.quantity;
        subPrice += product.finalPrice;
        finalProducts.push(product);
    }

    const order = await orderModel.create({
        user: req.user._id,
        products: finalProducts,
        subPrice,
        couponId: req.body.coupon?._id,
        totalPrice: subPrice - subPrice * ((req.body.coupon?.amount || 0) / 100),
        paymentMethod,
        status: paymentMethod === "Cash on delivery" ? "Order Placed" : "Payment",
        phone,
        address,
    });

    if (req.body?.coupon) {
        await couponModel.updateOne({ _id: req.body.coupon._id }, {
            $push: { userBy: req.user._id }
        })
    }

    for (const product of finalProducts) {
        await productModel.findByIdAndUpdate({
            _id: product.productId
        },
            {
                $inc: { stock: -product.quantity }
            })
    }

    if (isCartOrder) {
        await cartModel.updateOne({ user: req.user._id }, { products: [] })
    }

    // const invoice = {
    //     shipping: {
    //       name: req.user.firstName,
    //       address: req.user.address,
    //       city: "San Francisco",
    //       state: "CA",
    //       country: "US",
    //       postal_code: 94111
    //     },
    //     items: order.products,
    //     subtotal: subPrice,
    //     paid: order.totalPrice,
    //     invoice_nr: order._id,
    //     date: order.createdAt,
    //     coupon: req.body?.coupon?.amount || 0
    //   };

    //    await createInvoice(invoice, "invoice.pdf");

    //    await sendEmail(req.user.email, "Order Placed", "Your order has been confirmed successfully",[
    //     {
    //         path: "invoice.pdf",
    //         contentType: "application/pdf"
    //     },
    // {
    //     path: "invoice.image",
    //     contentType: "image/jpg"

    // }
    //    ])

    if (paymentMethod == "Pay with credit or debit card") {
        const stripe = new Stripe(process.env.Stripe_key)

        if (req.body?.coupon) {
            const coupon = await stripe.coupons.create({
                percent_off: req.body.coupon.amount,
                duration: "once"
            })
            req.body.couponId = coupon.id
        }

        const session = await payment({
            stripe,
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: req.user.email,
            metadata: {
                orderId: order._id.toString()
            },
            success_url: `${req.protocol}://${req.headers.host}/order/${order._id}`,
            cancel_url: `${req.protocol}://${req.headers.host}/order/${order._id}`,
            line_items : order.products.map((product) => {
                return{
                    price_data:{
                        currency: "EGP",
                        product_data:{
                            name: product.title
                        },
                        unit_amount: product.price * 100
                    },
                    quantity: product.quantity,
                }
            }),
        discounts: req.coupon?.coupon? [{ coupon: req.body.couponId}] : []
        })
        return res.status(201).json({ message: "payment method has been confirmed successfully", url: session.url, order });

    }
    return res.status(201).json({ message: "Your order has been confirmed successfully", order });
});




// //========== cancelOrder ===========//
export const cancelOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { reason } = req.body;

    // Find the order
    const order = await orderModel.findOne({
        _id: id,
        user: req.user._id,
        // status: { $in: ["Order Placed", "Packed", "Shipped"] },
    });

    if (!order) {
        return next(new AppError("Order not found ", 404));
    }

    if ((order.paymentMethod === "Cash on delivery" && order.status != "Order Placed") || (order.paymentMethod === "Pay with credit or debit card" && order.status != "Payment")) {
        return next(new AppError("Order cannot be canceled at this stage ", 404));

    }

    // Update the order status to "Cancelled"
    order.status = "Cancelled";
    order.cancelledBy = req.user._id;
    order.reason = reason;
    await order.save();

    // Restock the products
    for (const product of order.products) {
        await productModel.findByIdAndUpdate(
            { _id: product.productId },
            { $inc: { stock: product.quantity } }
        );
    }

    // If a coupon was used, remove the user from the usedBy array
    if (order.couponId) {
        await couponModel.findByIdAndUpdate(order.couponId, {
            $pull: { usedBy: req.user._id },
        });
    }

    return res.status(200).json({ message: "Your order has been canceled successfully", order });
});


