import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Breadcrumb, Col, Row } from "react-bootstrap";

import Loader from "../../../components/Loader";
import Product from "../../../components/Product";

const Sets = ({ products, currentUser }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products) {
      setLoading(false);
    }
  }, []);

  const sets = products.filter((product) => product.category === "Set");

  return (
    <>
      <Head>
        <title>Sets | Aurapan</title>
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
          <h1 className="category-header">Sets</h1>
          <Breadcrumb className="breadcrumb-label">
            <Link href="/" passHref>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Link>

            <Link href="/products/sets" passHref>
              <Breadcrumb.Item>Sets</Breadcrumb.Item>
            </Link>
          </Breadcrumb>

          <Row className="mx-0">
            {sets.map((item) => (
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

export default Sets;
