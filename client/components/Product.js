import React, { useState } from "react";
import Link from "next/link";
import { Card } from "react-bootstrap";

import Rating from "./Rating";
import Image from "next/image";
import AddToCart from "./AddToCart";
import ColorSelector from "./ColorSelector";

const Product = ({ product, currentUser }) => {
  const [color, setColor] = useState(null);

  const colorSelectedHandler = (color) => {
    if (color !== null) {
      setColor(color);
    }
  };

  const myLoader = ({ src, width, quality }) => {
    return `https://www.dropbox.com/s/${src}?raw=1&q=${quality || 20}`;
  };

  return (
    <Card className="mb-3 product-card">
      <div className="product-img">
        <Link href={`/products/[productId]`} as={`/products/${product.id}`}>
          <Card.Body className="product-img__cover">
            <Image
              loader={myLoader}
              src={product.images.image1 || product.image}
              layout="fill"
              objectFit="cover"
              // priority
              alt={`${product.title} image 1`}
            />
          </Card.Body>
        </Link>

        <Link href={`/products/[productId]`} as={`/products/${product.id}`}>
          <Card.Body className="product-img__hover">
            <Image
              loader={myLoader}
              src={
                product.images.image2 ||
                "4ojq7yz8ksrpln7/1050f24bf8dcd22c28fd9f15274765ce.jpg"
              }
              layout="fill"
              objectFit="cover"
              alt={`${product.title} image 2`}
            />
          </Card.Body>
        </Link>

        <div className="menu-tab">
          <AddToCart
            product={product}
            currentUser={currentUser}
            color={color}
          />
        </div>
      </div>

      <Card.Body className="px-2">
        <div className="d-flex flex-row justify-content-between">
          <Card.Title className="card-product-title" as="h4">
            <Link href={`/products/[productId]`} as={`/products/${product.id}`}>
              <a className="text-uppercase">{product.title}</a>
            </Link>
          </Card.Title>

          <Card.Text className="card-product-price" as="h4">
            ${product.price}
          </Card.Text>
        </div>

        <div className="d-flex flex-row justify-content-between">
          <Card.Text className="card-product-reviews" as="div">
            <Rating value={product.rating} text={`(${product.numReviews})`} />
          </Card.Text>

          <Card.Text className="card-product-color" as="div">
            <ColorSelector
              product={product}
              callback={colorSelectedHandler}
              margin={"0px"}
              size={"1rem"}
            />
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Product;
