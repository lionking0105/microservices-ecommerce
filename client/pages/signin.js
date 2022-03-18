import React, { useEffect, useState } from "react";
import Router from "next/router";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import useRequest from "../hooks/use-request";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Link from "next/link";

const signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => {
      Router.back();
      setLoading(false);
    },
  });

  useEffect(() => {
    if (errors) {
      setLoading(false);
      setShowErrors(true);
    }
  }, [errors]);

  const submitHandler = async (event) => {
    event.preventDefault();

    setLoading(true);
    doRequest();
  };

  return loading ? (
    <div
      className="d-flex justify-content-center align-items-center px-0"
      style={{ marginTop: "80px" }}
    >
      <Loader />
    </div>
  ) : (
    <Container className="app-container">
      <Row>
        <Col>
          <FormContainer>
            <h1>Sign In</h1>
            <Form className="mt-3" onSubmit={submitHandler}>
              <Form.Group controlId="email" className="my-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="password" className="my-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              {showErrors ? errors : null}
              <Button className="mt-3" type="submit" variant="dark">
                Sign In
              </Button>
            </Form>

            <Row className="py-3">
              <Col>
                New here ?{" "}
                <Link href="/signup">
                  <a>Create an Account</a>
                </Link>
              </Col>
            </Row>
          </FormContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default signin;
