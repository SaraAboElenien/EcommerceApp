import userModel from '../db/models/user.model.js';
import jwt from 'jsonwebtoken';

export const auth = ( role =[]) => {
    return async (req, res, next) => {
        try {
            const { token } = req.headers;
            if (!token) {
                return res.status(400).json({ message: "Token not found!" });
            }
            const decoded = jwt.verify(token, process.env.confirmationKey);
            if (!decoded?.id) {
                return res.status(400).json({ message: "Invalid payload!" });
            }
            const user = await userModel.findById(decoded.id);
            if (!user) {
                return res.status(400).json({ message: "User not found!" });
            }
            if (parseInt(user?.passwordChangedAt?.getTime() / 1000) > decoded.iat) {
                return res.status(403).json({ message: "Token expired, please login again!" });

            }

            if (!role.includes(user.role)) {
                return res.status(401).json({ message: "Sorry! you're not authorzied" });

            }
            req.user = user;
            next();
        } catch (error) {
            return res.status(400).json({ message: "Catch error", error: error.message });
        }

    }
}