import { connection } from '../db/connection.js';
import { AppError } from '../utils/classError.js';
import { globleErrorHandling } from '../utils/globleErrorHandling.js';
import * as routers from "../src/modules/index.routes.js";
import { deleteFromCloudinary } from '../utils/deleteFromCloudinary.js';
import { deleteFromDB } from '../utils/deleteFromDB.js';
import cors from "cors"

export const initApp = (app, express) => {

app.get("/", (req, res) =>{
    res.status(200).json({message: "Your project is now ONLINE SARA"})
})



    app.use(cors())
    app.use(express.json());
    connection();



    app.use('/api/v1/auth/user', routers.userRoutes)
    app.use('/api/v1/category', routers.categoryRoutes)
    app.use('/api/v1/subCategory', routers.subCategoryRoutes)
    app.use('/api/v1/brand', routers.brandRoutes)
    app.use('/api/v1/product', routers.productRoutes)
    app.use('/api/v1/coupon', routers.couponRoutes)
    app.use('/api/v1/cart', routers.cartRoutes)
    app.use('/api/v1/order', routers.orderRoutes)
    app.use('/api/v1/review', routers.reviewRoutes)
    app.use('/api/v1/wishlist', routers.wishlistRoutes)





    app.get('*', (req, res, next) => {
        const err = new AppError(`Invalid URL${req.originalUrl}`, 404)
        next(err)
    })



    app.use(globleErrorHandling, deleteFromCloudinary, deleteFromDB)

}

