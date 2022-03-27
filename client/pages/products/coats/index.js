import Head from "next/head";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import Loader from "../../../components/Loader";
import Product from "../../../components/Product";

const Coats = ({ products, currentUser }) => {
  const [onMobile, setOnMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= 576) {
      setOnMobile(true);
    } else {
      setOnMobile(false);
    }

    if (products) {
      setLoading(false);
    }
  }, []);

  const coats = products.filter((product) => product.category === "Coat");

  return (
    <>
      <Head>
        <title>Coats | Aurapan</title>
      </Head>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center px-0"
          style={{ marginTop: "80px" }}
        >
          <Loader />
        </div>
      ) : (
        <>
          <h1 className="category-header">Coats</h1>
          <Breadcrumb className={onMobile ? "px-3" : "px-5"}>
            <Link href="/" passHref>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Link>

            <Link href="/products/coats" passHref>
              <Breadcrumb.Item>Coats</Breadcrumb.Item>
            </Link>
          </Breadcrumb>

          <Row className="mx-0">
            {coats.map((item) => (
              <Col key={item.id} xs={6} md={4} xl={3} className="p-0">
                <Product product={item} currentUser={currentUser} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default Coats;
