import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  adminUser,
  BadRequestError,
} from "@thasup-dev/common";

import { Product } from "../models/product";
import { ProductUpdatedPublisher } from "../events/publishers/ProductUpdatedPublisher";
import { natsWrapper } from "../NatsWrapper";

const router = express.Router();

router.patch(
  "/api/products/:id",
  requireAuth,
  adminUser,
  [
    param("id").isMongoId().withMessage("Invalid MongoDB ObjectId"),
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      title,
      price,
      image,
      colors,
      sizes,
      brand,
      category,
      material,
      description,
      reviews,
      numReviews,
      rating,
      countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError();
    }

    if (product.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    product.title = title ?? product.title;
    product.price = price ?? product.price;
    product.image = image ?? product.image;
    product.colors = colors ?? product.colors;
    product.sizes = sizes ?? product.sizes;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.material = material ?? product.material;
    product.description = description ?? product.description;
    product.reviews = reviews ?? product.reviews;
    product.numReviews = numReviews ?? product.numReviews;
    product.rating = rating ?? product.rating;
    product.countInStock = countInStock ?? product.countInStock;

    console.log("before", product.version);

    await product.save();

    console.log("after", product.version);

    new ProductUpdatedPublisher(natsWrapper.client).publish({
      id: product.id,
      title: title,
      price: price,
      userId: product.userId,
      image: image,
      colors: colors,
      sizes: sizes,
      brand: brand,
      category: category,
      material: material,
      description: description,
      numReviews: numReviews,
      rating: rating,
      countInStock: countInStock,
      version: product.version,
    });

    res.send(product);
  }
);

export { router as updateProductRouter };
