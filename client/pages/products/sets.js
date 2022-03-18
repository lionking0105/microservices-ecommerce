import { Col, Row } from "react-bootstrap";
import buildClient from "../../api/build-client";
import Product from "../../components/Product";

const Sets = ({ products, currentUser }) => {
  const sets = products.filter((product) => product.category === "Set");

  return (
    <>
      <Row className="mx-0">
        {sets.map((item) => (
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

export default Sets;
