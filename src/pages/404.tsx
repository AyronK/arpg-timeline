import * as React from "react";
import { Layout } from "../components/Layout";

const NotFoundPage = () => (
  <Layout>
    <div className="container mx-auto px-4 mb-20">
      <h1 className="text-4xl font-semibold text-center pt-12 pb-4">
        <h1>NOT FOUND</h1>
      </h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </div>
  </Layout>
);

export default NotFoundPage;
