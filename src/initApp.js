import { connection } from '../db/connection.js';
import { AppError } from '../utils/classError.js';
import { globleErrorHandling } from '../utils/globleErrorHandling.js';
import * as routers  from "../src/modules/index.routes.js";


export const initApp = (app, express) =>{

    const port = 3000


    app.use(express.json());
    connection();
    
    
    
    app.use('/api/v1/auth/user', routers.userRoutes)
    app.get('*', (req, res, next) => {
        const err = new AppError(`Invalid URL${req.originalUrl}`, 404)
        next(err)
    })
    
    
    
    app.use(globleErrorHandling)
    app.listen(port, () => console.log(`running successfully on ${port}!`))

}

