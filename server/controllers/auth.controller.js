import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10)      // hashSync is an async method itself, the 2nd parameter is the SALT used for encryption purposes
    const user = new User({ username, email, password: hashedPassword });
    await user.save()
        .then(() => { res.status(201).json("User created successfully.") })
        .catch((err) => next(err) );
};