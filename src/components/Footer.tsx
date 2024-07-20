import React from "react";

export const Footer = () => (
  <footer className="mb-8 mt-12 px-4">
    <div>
      <div className="mt-4 flex flex-row justify-end gap-1">
        <a
          title="RSS Feed"
          target="_blank"
          rel="noopener noreferrer nofollow licence"
          className="font-semibold hover:opacity-75"
          href="/assets/about.txt"
        >
          Licences
        </a>
      </div>

      <div className="mt-4 flex flex-row justify-end gap-1">
        <a
          className="font-semibold hover:opacity-75"
          href="/privacy"
          rel="self"
        >
          Privacy & GDPR
        </a>
      </div>

      <div className="mt-4 flex flex-row justify-end gap-1">
        <a
          className="font-semibold hover:opacity-75"
          href="mailto:arpgtimeline@ayronk.com"
          rel="noopener noreferrer"
        >
          Contact
        </a>
      </div>

      <div className="mt-4 flex flex-row justify-end gap-1">
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
