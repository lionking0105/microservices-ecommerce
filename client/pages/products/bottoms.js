import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import buildClient from "../../api/build-client";
import Loader from "../../components/Loader";
import Product from "../../components/Product";

const Bottoms = ({ products, currentUser }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products) {
      setLoading(false);
    }
  }, []);

  const bottoms = products.filter((product) => product.category === "Bottom");

  return loading ? (
    <div
      className="d-flex justify-content-center align-items-center px-0"
      style={{ marginTop: "80px" }}
    >
      <Loader />
    </div>
  ) : (
    <>
      <Row className="mx-0">
        {bottoms.map((item) => (
          <Col key={item.id} xs={6} md={4} xl={3} className="p-0">
            <Product product={item} currentUser={currentUser} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get("/api/products").catch((err) => {
    console.log(err.message);
  });

  return { props: { products: data } };
}

export default Bottoms;
