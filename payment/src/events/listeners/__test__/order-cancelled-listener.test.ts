import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderStatus, OrderCancelledEvent } from "@thasup-dev/common";

import { OrderCancelledListener } from "../OrderCancelledListener";
import { natsWrapper } from "../../../NatsWrapper";
import { Order } from "../../../models/order";
import { Product } from "../../../models/product";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

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

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    product,
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    status: OrderStatus.Cancelled,
    userId: order.userId,
    expiresAt: new Date(),
    version: 1,
    product: {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      colors: product.colors,
      sizes: product.sizes,
      countInStock: product.countInStock,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("updates the status of the order", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
