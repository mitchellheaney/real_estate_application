import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (err) {
        next(err);
    }
};

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, 'Listing not found.'));
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'Can only delete own listings.'));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Lisitng deleted.");
    } catch (err) {
        next(err)
    }
};

export const editListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) { return next(errorHandler(404, 'Listing not found.')) }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'Can only edit own listings.'));
    }

    try {
        const edittedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );
        res.status(200).json(edittedListing);
    } catch (err) {
        next(err);
    }
};

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) { return next(errorHandler(404, 'Listing not found!')) }
        res.status(200).json(listing);
    } catch (err) {
        next(err);
    }
};