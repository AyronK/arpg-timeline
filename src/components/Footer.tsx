import React from "react";

export const Footer = () => (
  <footer className="mt-12 container mx-auto px-4 mb-8">
    <div className="mx-auto max-w-prose">
      {/* TODO: Uncomment when RSS feed is fixed
    <div className="flex flex-row justify-end mt-4 gap-1">
      <a
        title="RSS Feed"
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="font-semibold hover:opacity-75"
        href="/assets/rss.xml"
      >
        RSS
      </a>
    </div> */}

      <div className="flex flex-row justify-end mt-4 gap-1">
        <a
          title="RSS Feed"
          target="_blank"
          rel="noopener noreferrer nofollow licence"
          className="font-semibold hover:opacity-75"
          href="/assets/about.txt"
        >
          About site and licences
        </a>
      </div>

      <div className="flex flex-row justify-end mt-4 gap-1">
        <a
          target="_blank"
          className="font-semibold hover:opacity-75"
          href="https://100dayscss.ayronk.com/"
          rel="me"
        >
          My other work
        </a>
      </div>

      <div className="flex flex-row justify-end mt-4 gap-1">
        <a
          className="font-semibold hover:opacity-75"
          href="/privacy"
          rel="self"
        >
          Privacy & GDPR
        </a>
      </div>

      <div className="flex flex-row justify-end mt-4 gap-1">
        <a
          className="font-semibold hover:opacity-75"
          href="mailto:arpgtimeline@ayronk.com"
          rel="noopener noreferrer"
        >
          Contact
        </a>
      </div>

      <div className="flex flex-row justify-end mt-4 gap-1">
        &copy; <span id="currentYear">{new Date().getFullYear()}</span>-
        <a
          className="font-semibold hover:opacity-75"
          href="https://github.com/AyronK"
          rel="external nofollow"
          target="_blank"
          aria-label="Author's Github Profile - AyronK"
        >
          AyronK @ GitHub
        </a>
      </div>
    </div>
  </footer>
);
