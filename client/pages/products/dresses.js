import Head from "next/head";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import Loader from "../../components/Loader";
import Product from "../../components/Product";

const Dresses = ({ products, currentUser }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products) {
      setLoading(false);
    }
  }, []);

  const dresses = products.filter((product) => product.category === "Dress");

  return (
    <>
      <Head>
        <title>Dresses | Aurapan</title>
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
          <Row className="mx-0">
            {dresses.map((item) => (
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

export default Dresses;
