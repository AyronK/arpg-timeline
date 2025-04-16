import { Layout } from "@/components/Layout";

const NotFoundPage = () => (
  <Layout>
    <div className="container mx-auto mb-20 max-w-prose px-4">
      <h2 className="pt-12 pb-4 text-center text-2xl font-semibold">
        NOT FOUND
      </h2>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </div>
  </Layout>
);

export { Head } from "@/components/Layout";

export default NotFoundPage;
