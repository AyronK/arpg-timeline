import * as React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/Button";

const IndexPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 mb-20 max-w-prose">
        <h2 className="text-2xl font-semibold text-center pt-2 pb-4">
          Privacy
        </h2>
        <p>
          At <i>arpg-timeline.ayronk.com</i>, your privacy is important. I want
          to be transparent about how the website collects and uses information
          when you visit our website.
          <br />
          <br />
          We do not use cookies nor do we process any personal data.
          <br />
          <br />
          We use Simple Analytics for website analytics. Simple Analytics
          collects and processes anonymous metrics and provides us with
          information to help us understand how visitors use our website and
          where our traffic comes from. Read more{" "}
          <Button className="px-0 text-base" variant="link" asChild>
            <a
              href="https://docs.simpleanalytics.com/gdpr"
              rel="noopener nofolow"
              target="_blank"
            >
              here
            </a>
          </Button>
          .
          <br />
          <br />
          Additionally, this website uses local storage to keep user data in the
          browser. This data remains on your device and is not transmitted to
          any servers or any third parties.
          <br />
          <br />
          Thank you for visiting the website. If you have any questions about
          our privacy practices, please contact me on{" "}
          <Button className="px-0 text-base" variant="link" asChild>
            <a
              href="https://github.com/AyronK/arpg-timeline/issues"
              rel="noopener nofolow"
              target="_blank"
            >
              GitHub
            </a>
          </Button>
          .
        </p>
      </div>
    </Layout>
  );
};

export { Head } from "@/components/Layout";

export default IndexPage;
