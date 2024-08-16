import userModel from '../db/models/user.model.js';
import jwt from'jsonwebtoken';

export const auth = () => {
    return async (req, res, next) => {
        try {
            const { token } = req.headers;
            if (!token) {
                return res.status(400).json({ message: "Token not found!" });
            }
            // console.log('Received Token:', token);
            // if (!token.startsWith("CYU")) {
            //     return res.status(400).json({ message: "Token not valid!" });
            // }
            // const newToken = token.split("CYU")[1];
            // if (!newToken) {
            //     return res.status(400).json({ message: "Token not found!" });
            // }
            const decoded = jwt.verify(token, 'Sara2000');
            console.log('Decoded Token:', decoded);
            if (!decoded?.id) {
                return res.status(400).json({ message: "Invalid payload!" });
            }
            const user = await userModel.findById(decoded.id);
            if (!user) {
                return res.status(400).json({ message: "User not found!" });
            }
            req.user = user;
            next();
        } catch (error) {
            console.error('Error in auth middleware:', error);
            return res.status(400).json({ message: "Catch error", error: error.message });
        }
        
    }
}