import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
dotenv.config();

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10)      // hashSync is an async method itself, the 2nd parameter is the SALT used for encryption purposes
    const user = new User({ username, email, password: hashedPassword });
    await user.save()
        .then(() => { res.status(201).json("User created successfully.") })
        .catch((err) => next(err) );
};

export const signin = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const validUser = await User.findOne({ username });
        if (!validUser) { return next(errorHandler(404, 'User not found.')) }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) { return next(errorHandler(401, 'Incorrect credentials.')) }
        const token = jwt.sign( { id: validUser._id }, process.env.JWT_SECRET )

        const {password: pass, ...rest} = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } catch (err) {
        next(err);
    }
};