import * as React from "react";
import { Layout } from "../components/Layout";

const NotFoundPage = () => (
  <Layout>
    <div className="container mx-auto px-4 mb-20 max-w-prose">
      <h2 className="text-2xl font-semibold text-center pt-12 pb-4">
        NOT FOUND
      </h2>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </div>
  </Layout>
);

export { Head } from "@/components/Layout";

export default NotFoundPage;
