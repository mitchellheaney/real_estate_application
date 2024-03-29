import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();

// Connection to the mongoDB database
mongoose.connect(process.env.MONGO)
    .then(() => {console.log("Connected to MongoDB")})
    .catch((err) => {console.log(err)})

    const __dirname = path.resolve();

// Start the backend API routes
const app = express();

app.use(express.json());            // Allows us to use json body data to be sent to our backend

app.use(cookieParser());

app.listen(3000, () => {
    console.log("Listening on PORT: 3000");
});

// Specifiy the routes we wish to use
app.use("/server/user", userRouter);
app.use("/server/auth", authRouter);
app.use("/server/listing", listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error middleware
// This middleware will be invoked every time the next() function is called in the controllers logic
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message,
    })
});