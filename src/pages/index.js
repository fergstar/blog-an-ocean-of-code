import React from "react";
import Link from "gatsby-link";
import Container from "../components/container";

export default () => (
  <Container>
      <h1>In an ocean of code.</h1>
      <p>What a world.</p>
      <img src="https://source.unsplash.com/random/400x200" alt="" />
      <br />
      <div>
        <Link to="/about/">About</Link>
      </div>
  </Container>
 );
