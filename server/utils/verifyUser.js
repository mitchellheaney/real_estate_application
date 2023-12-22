import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) { next(errorHandler(401, 'Unauthorized')) }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) { return next(errorHandler(403, 'Forbidden')) }

        req.user = user;        // If there are no error here, we will go to the next function updateUser in user.route.js
        next();
    });
};