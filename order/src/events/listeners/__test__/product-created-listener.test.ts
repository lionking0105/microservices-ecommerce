import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { ProductCreatedEvent } from "@thasup-dev/common";
import { ProductCreatedListener } from "../ProductCreatedListener";
import { Product } from "../../../models/product";
import { natsWrapper } from "../../../NatsWrapper";

const setup = async () => {
  // create an instance of the listener
  const listener = new ProductCreatedListener(natsWrapper.client);

  // Create and save a product
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Sample Dress",
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: 1,
  });
  await product.save();

  // create a fake data event
  const data: ProductCreatedEvent["data"] = {
    version: 0,
    id: product.id,
    title: "Sample Dress",
    price: 1990,
    userId: product.userId,
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    brand: "Uniqlo",
    category: "Dress",
    material: "Polyester 100%",
    description:
      "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
    numReviews: 0,
    rating: 0,
    countInStock: 1,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a product", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a product was created!
  const product = await Product.findById(data.id);

  console.log(product);

  expect(product).toBeDefined();
  expect(product!.title).toEqual(data.title);
  expect(product!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
