import * as React from "react";
import { Layout } from "@/components/Layout";

const Page = () => {
  return (
    <Layout>
      <div className="container mx-auto mb-20 min-h-[60vh] max-w-prose px-4">
        <h2 className="mb-6 mt-12 pb-4 pt-2 text-center text-2xl font-semibold">
          Looking for Moderators
        </h2>
        <p className="mb-4">
          Join our team of moderators and help us build the aRPG Timeline!
        </p>
        <p className="mb-4">
          As a moderator, you'll play a crucial role in keeping the website up
          to date. If you stay informed about your favorite games and want to
          help build this community, please{" "}
          <a
            className="font-semibold hover:opacity-75"
            href="https://discord.gg/agAVP5jm"
            rel="noopener noreferrer"
          >
            contact us on Discord
          </a>{" "}
          or{" "}
          <a
            className="font-semibold hover:opacity-75"
            href="mailto:arpgtimeline@ayronk.com"
            rel="noopener noreferrer"
          >
            send an email
          </a>
          .
        </p>
        <p className="mb-4">
          <span className="font-semibold">Why we need you:</span>
          <ul className="ml-4 list-inside list-disc">
            <li>Help verify season launch and end dates.</li>
            <li>Contribute to website content.</li>
            <li>Suggest new features.</li>
            <li>Assist in further automating processes.</li>
          </ul>
        </p>
        <p className="mb-4">
          While we strive to automate as much as possible, the human crosscheck
          is essential for maintaining the website's reliability.
        </p>
      </div>
    </Layout>
  );
};

export { Head } from "@/components/Layout";

export default Page;
