import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  ListGroup,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import ReactStars from "react-rating-stars-component";

import Loader from "../../components/Loader";
import Rating from "../../components/Rating";
import Message from "../../components/Message";
import buildClient from "../../api/build-client";
import useRequest from "../../hooks/use-request";
import NextImage from "../../components/NextImage";
import SocialShare from "../../components/SocialShare";
import ColorSelector from "../../components/ColorSelector";
import SizeSelector from "../../components/SizeSelector";

const productDetail = ({ products, currentUser }) => {
  const { productId } = useRouter().query;

  const [qty, setQty] = useState(1);
  const [discount, setDiscount] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [comment, setComment] = useState("");

  const [imageArray, setImageArray] = useState([]);
  const [imageEvent, setImageEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingApply, setLoadingApply] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);
  const [discountFactor, setDiscountFactor] = useState(1);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [initialImage, setInitialImage] = useState(false);
  const [onAdd, setOnAdd] = useState(false);

  const { doRequest: addReview, errors: addReviewErrors } = useRequest({
    url: `/api/products/${productId}/reviews`,
    method: "post",
    body: {
      title: reviewTitle,
      rating,
      comment,
    },
    onSuccess: (review) => {
      console.log(review);
      setLoadingReview(false);
      Router.push(`/products/${productId}`);
    },
  });

  const { doRequest: removeReview, errors: deleteReviewErrors } = useRequest({
    url: `/api/products/${productId}/reviews`,
    method: "delete",
    body: {},
    onSuccess: () => {
      console.log("successfully deleted a review");
      setLoading(false);
      Router.push(`/products/${productId}`);
    },
  });

  useEffect(() => {
    if (!initialImage) {
      const mainImage = document.getElementsByClassName("product-main-img");
      mainImage[0].classList.add("toggle-main-img");
      setInitialImage(true);
    }

    if (imageEvent) {
      const mainImage = document.getElementsByClassName("product-main-img");
      const sideImage = document.getElementsByClassName("product-side-img");

      for (let i = 0; i < mainImage.length; i++) {
        mainImage[i].classList.remove("toggle-main-img");
      }

      const currentId =
        imageEvent.target.parentElement.parentElement.id.slice(-1);

      mainImage[currentId].classList.add("toggle-main-img");

      for (let i = 0; i < sideImage.length; i++) {
        sideImage[i].classList.remove("toggle-side-img");
      }

      imageEvent.target.parentElement.parentElement.classList.add(
        "toggle-side-img"
      );
      setImageEvent(null);
    }

    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];

    const item = {
      userId: currentUser?.id || null,
      title: product.title,
      qty: Number(qty),
      image: product.images.image1,
      price: product.price,
      countInStock: product.countInStock - Number(qty),
      discount: discountFactor,
      productId: productId,
    };

    if (onAdd) {
      // Check if the product exist in cart
      const existItem = cartItems.find((x) => x.productId === productId);

      // If it existed, replace it with new data
      if (existItem) {
        cartItems = cartItems.map((x) =>
          x.productId === existItem.productId ? item : x
        );
      } else {
        cartItems.push(item);
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setOnAdd(false);
      setLoadingUpdate(false);
    }
  }, [onAdd, loading, imageEvent]);

  const product = products.find((product) => product.id === productId);

  if (imageArray.length === 0 && product) {
    const filterImages = Object.values(product.images).filter(
      (image) => image !== null && image !== ""
    );

    setImageArray(filterImages);
  }

  const applyCoupon = (e) => {
    e.preventDefault();
    setLoadingApply(true);

    switch (discount) {
      case "free":
        console.log("free");
        setDiscountFactor(0);
        break;
      case "grandsale":
        console.log("grandsale");
        setDiscountFactor(0.5);
        break;
      case "hotdeal":
        console.log("hotdeal");
        setDiscountFactor(0.75);
        break;
      default:
        setDiscountFactor(1);
    }

    if (
      discount === "free" ||
      discount === "grandsale" ||
      discount === "hotdeal"
    ) {
      setCouponSuccess(true);
      setCouponError(false);
    } else {
      setCouponSuccess(false);
      setCouponError(true);
    }

    setLoadingApply(false);
  };

  const addToCartHandler = (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setOnAdd(true);
  };

  const submitReviewHandler = (e) => {
    e.preventDefault();
    setLoadingReview(true);
    addReview();
  };

  const deleteReviewHandler = (review) => {
    if (currentUser && review.userId === currentUser?.id) {
      setLoading(true);
      removeReview();
    } else {
      alert("No authorized");
    }
  };

  const myLoader = ({ src, width, quality }) => {
    return `${src}&w=${width}&q=${quality || 40}`;
  };

  return (
    <div className="px-5">
      <Link href="/" passHref>
        <a className="btn btn-outline-dark mb-3">Back</a>
      </Link>
      {!product.id || product.id !== productId ? (
        <Loader />
      ) : (
        <>
          <Row>
            <Col lg={1} className="mb-3">
              {imageArray.map((img, index) => (
                <div
                  className="product-side-img"
                  id={`side-img-${index}`}
                  key={index}
                  onClick={(e) => setImageEvent(e)}
                >
                  <NextImage
                    src={img}
                    alt={`product_image_${index}`}
                    priority={true}
                    quality={30}
                  />
                </div>
              ))}
            </Col>

            <Col lg={5} className="mb-3 position-relative">
              {imageArray.map((img, index) => (
                <div className="product-main-img" key={index}>
                  <NextImage
                    src={img}
                    alt={`product_image_${index}`}
                    priority={true}
                    quality={75}
                  />
                </div>
              ))}
            </Col>

            <Col lg={6}>
              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item className="py-0">
                  <Rating value={product.rating} />
                </ListGroup.Item>
                <ListGroup.Item>
                  <h1>{product.title}</h1>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>$ {product.price}</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h3>Color</h3>
                  <ColorSelector product={product} />
                </ListGroup.Item>
                <ListGroup.Item>
                  <h3>Size</h3>
                  <SizeSelector product={product} width={"35px"} />
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="my-2">Description:</div>
                  <div>{product.description}</div>
                </ListGroup.Item>

                <ListGroup.Item>
                  <SocialShare product={product} />
                </ListGroup.Item>
              </ListGroup>

              <Card>
                <ListGroup>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <>
                      <ListGroup.Item>
                        <Row>
                          <Col>Qty:</Col>
                          <Col>
                            <Form.Control
                              className="form-select"
                              as="select"
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (obj) => (
                                  <option key={obj + 1} value={obj + 1}>
                                    {obj + 1}
                                  </option>
                                )
                              )}
                            </Form.Control>
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Row className="px-3">
                          {couponError && (
                            <div className="px-0 py-2" style={{ color: "red" }}>
                              {
                                "The coupon code entered is not valid for this product"
                              }
                            </div>
                          )}
                          {couponSuccess ? (
                            <div className="px-0 py-2">{`${discount} is applied`}</div>
                          ) : (
                            <>
                              <Form.Label className="px-0">Coupon:</Form.Label>
                              <Form.Control
                                className="coupon-text text-uppercase"
                                type="text"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                              ></Form.Control>
                              <Button
                                className="coupon-button"
                                onClick={applyCoupon}
                                type="button"
                                variant="dark"
                                placeholder="Enter Coupon"
                              >
                                {loadingApply ? (
                                  <Spinner
                                    animation="border"
                                    role="status"
                                    as="span"
                                    size="sm"
                                    aria-hidden="true"
                                  >
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </Spinner>
                                ) : (
                                  <>Apply</>
                                )}
                              </Button>
                            </>
                          )}
                        </Row>
                      </ListGroup.Item>
                    </>
                  )}

                  <ListGroup.Item className="d-grid">
                    <Button
                      onClick={addToCartHandler}
                      type="button"
                      variant="dark"
                      disabled={product.countInStock < 1}
                    >
                      {loadingUpdate ? (
                        <Spinner
                          animation="border"
                          role="status"
                          as="span"
                          size="sm"
                          aria-hidden="true"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      ) : null}{" "}
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {deleteReviewErrors}
          <Row className="mt-3 pb-5">
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && !loading && (
                <Message variant="secondary">No Reviews</Message>
              )}
              <ListGroup variant="flush">
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    {product.reviews.map((review) => (
                      <ListGroup.Item key={review.id}>
                        <Row>
                          {currentUser?.image && (
                            <Col xs={2} className="profile-img">
                              <Image
                                loader={myLoader}
                                src={currentUser.image}
                                alt="profile image"
                                width={200}
                                height={200}
                                layout="responsive"
                              />
                            </Col>
                          )}

                          <Col xs={10}>
                            <strong>{review.name}</strong>
                            <Rating value={review.rating} />
                            <p>{review.createdAt.substring(0, 10)}</p>
                            <strong>{review.title}</strong>
                            <p>{review.comment}</p>
                          </Col>
                          {review.userId === currentUser?.id && (
                            <Col className="trash-btn">
                              <button
                                type="button"
                                className="btn-sm mx-1 btn btn-danger"
                                onClick={() => deleteReviewHandler(review)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </Col>
                          )}
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </>
                )}

                {currentUser ? (
                  <>
                    {!product.reviews.some(
                      (review) => review.userId === currentUser?.id
                    ) && (
                      <ListGroup className="mt-3">
                        <h2>Write a Review</h2>
                        {addReviewErrors}
                        <Form onSubmit={submitReviewHandler}>
                          <Form.Group className="my-3">
                            <Form.Label>Rating</Form.Label>
                            <ReactStars
                              count={5}
                              size={40}
                              isHalf={true}
                              emptyIcon={<i class="fa-light fa-star"></i>}
                              halfIcon={
                                <i className="fa-solid fa-star-half-alt"></i>
                              }
                              fullIcon={<i class="fa-solid fa-star"></i>}
                              activeColor="#000"
                              value={rating}
                              onChange={(newValue) => setRating(newValue)}
                            />
                          </Form.Group>

                          <Form.Group controlId="reviewTitle" className="my-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter review title"
                              value={reviewTitle}
                              onChange={(e) => setReviewTitle(e.target.value)}
                            ></Form.Control>
                          </Form.Group>

                          <Form.Group controlId="comment" className="my-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                              as="textarea"
                              className="text-area"
                              placeholder="Write a review"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            ></Form.Control>
                          </Form.Group>

                          <Button type="submit" variant="dark">
                            {loadingReview ? (
                              <Spinner
                                animation="border"
                                role="status"
                                as="span"
                                size="sm"
                                aria-hidden="true"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Spinner>
                            ) : null}{" "}
                            Submit
                          </Button>
                        </Form>
                      </ListGroup>
                    )}
                  </>
                ) : (
                  <Message>
                    Please{" "}
                    <Link href="/signin">
                      <a>sign in</a>
                    </Link>{" "}
                    to write a review
                  </Message>
                )}
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get("/api/products").catch((err) => {
    console.log(err.message);
  });

  return { props: { products: data } };
}

export default productDetail;
