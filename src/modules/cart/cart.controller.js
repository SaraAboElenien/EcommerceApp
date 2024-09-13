import cartModel from '../../../db/models/cart.model.js';
import { asyncHandler } from '../../../utils/globleErrorHandling.js';
import { AppError } from '../../../utils/classError.js';
import productModel from '../../../db/models/product.model.js';



//========== create/updateCart ===========//
export const createCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const product = await productModel.findOne({ _id: productId, stock:{ $gte: quantity} });
    if (!product) {
        return next(new AppError("This product is out of stock", 404));
    }
    const cartExists = await cartModel.findOne({user: req.user._id})
    if (!cartExists) {
        const cart = await cartModel.create({
            user: req.user._id,
            products:[{
                productId,
                quantity
            }]
        })
        return res.status(201).json({ message: "cart created successfully", cart });
    }
let alert = false 
for (const product of cartExists.products){
    if (productId == product.productId) {
        product.quantity = quantity
        alert = true
    }
}
if (!alert) {
    cartExists.products.push({
        productId,
        quantity
    })
}
await cartExists.save()
return res.status(201).json({ message: "product added successfully", cart: cartExists });

});



//========== removeFromCart ===========//
export const removeFromCart = asyncHandler(async (req, res, next) => {
    const { productId } = req.body;

    const cart = await cartModel.findOneAndUpdate(
        {
            user: req.user._id,
            "products.productId": productId
        },
        {
            $pull: { products: { productId } }
        },
        { new: true }
    );

    if (!cart) {
        return next(new AppError("Product not found in cart or cart does not exist", 404));
    }

    return res.status(200).json({ message: "Product removed successfully from cart", cart });
});


//========== clearCart ===========//
export const clearCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate(
        {
            user: req.user._id,
        },{
            products: []
        }
        ,{ new: true }
    );
    if (!cart) {
        return next(new AppError("Product not found in cart or cart does not exist", 404));
    }

    return res.status(200).json({ message: "Cart is now empty", cart });
});

