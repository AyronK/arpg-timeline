import { Layout } from "@/components/Layout";
import { Button } from "@/ui/Button";

const IndexPage = () => {
  return (
    <Layout>
      <div className="container mx-auto mb-20 max-w-prose px-4">
        <h2 className="pt-2 pb-4 text-center text-2xl font-semibold">
          Privacy
        </h2>
        <p>
          At <i>arpg-timeline.com</i>, your privacy is important. I want to be
          transparent about how the website collects and uses information when
          you visit our website.
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
              rel="noopener nofolow noreferrer"
              target="_blank"
            >
              here
            </a>
          </Button>
          .
          <br />
          <br />
          Additionally, this website uses local storage to keep user settings
          such as theme or filters in the browser. We do NOT store any personal
          data in local storage. This data remains on your device and is not
          transmitted to any servers or any third parties.
          <br />
          <br />
          Thank you for visiting the website. If you have any questions about
          our privacy practices, please contact me on{" "}
          <Button className="px-0 text-base" variant="link" asChild>
            <a
              href="https://github.com/AyronK/arpg-timeline/issues"
              rel="noopener nofolow noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </Button>
          .
        </p>
        <h2 className="pt-2 pb-4 text-center text-2xl font-semibold">
          What we do and do not collect
        </h2>
        <p>
          You can read a thourough report{" "}
          <Button className="px-0 text-base" variant="link" asChild>
            <a
              href="https://docs.simpleanalytics.com/what-we-collect"
              rel="noreferrer noopener"
              target="_blank"
            >
              here
            </a>
          </Button>{" "}
          and{" "}
          <Button className="px-0 text-base" variant="link" asChild>
            <a
              href="https://docs.simpleanalytics.com/metrics"
              rel="noreferrer noopener"
              target="_blank"
            >
              here
            </a>
          </Button>
          .
        </p>
        <p>
          By default we do NOT collect or store any data if a visitor has{" "}
          <i>Do Not Track</i> enabled.
          <br />
          <br />
          Otherwise:
          <ul className="list list-inside list-disc">
            <li>We do collect and store whether visits are unique</li>
            <li>
              We do <strong>NOT</strong> set any cookies (or use similar
              technologies)
            </li>
            <li>
              We do <strong>NOT</strong> collect or store IP addresses
            </li>
            <li>We do collect and store timestamps</li>
            <li>We do collect and store user agents anonymized</li>
            <li>We collect and store country of visitor</li>
            <li>We collect and store the language of the visitor</li>
            <li>We do collect and partially store referrers</li>
            <li>We do collect and store device dimensions</li>
            <li>We do collect and store how long a page is being viewed</li>
          </ul>
        </p>
      </div>
    </Layout>
  );
};

export { Head } from "@/components/Layout";

export default IndexPage;
