import React from "react";

export const Footer = () => (
  <footer className="mt-12 container mx-auto px-4 mb-8">
    <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-8">
      <a
        className="min-w-[200px]"
        href="https://www.buymeacoffee.com/ayron"
        rel="external nofollow"
        target="_blank"
      >
        <img
          loading="lazy"
          src="/assets/bmc-button.png"
          width="200"
          alt="Buy me a coffee logo"
        />
      </a>
      <div className="flex">
        <a
          href="https://github.com/AyronK/arpg-timeline/issues"
          rel="external nofollow"
          target="_blank"
        >
          <div className="rounded-lg p-3 bg-emerald-200 text-black font-semibold flex flex-row gap-3 align-middle">
            <svg
              height="32"
              aria-hidden="true"
              viewBox="0 0 16 16"
              version="1.1"
              width="32"
              data-view-component="true"
              className="octicon octicon-mark-github v-align-middle color-fg-default"
            >
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
            <span className="my-auto text-nowrap">Request a feature</span>
          </div>
        </a>
      </div>
    </div>
    <section className="my-12 flex flex-col gap-4 container">
      <div className="mx-auto max-w-prose">
        <h2 className="text-2xl">FAQ</h2>

        <h3 className="font-semibold mt-1">Why does this page exist?</h3>
        <p className="ml-2">
          ARPG is a very special genre. The large part of these games' community
          are the same people cycling between new cycles. If you are one of
          these people that play these games for a couple of days or weeks each
          cycle, this site can help you plan your time in regard of new
          releases!
        </p>

        <h3 className="font-semibold mt-1">
          Are dates displayed in my local time?
        </h3>
        <p className="ml-2">
          Yes! All dates are displayed in the local time of your machine. You
          can even add an event to your favorite calendar!
        </p>

        <h3 className="font-semibold mt-1">
          What does the "UNOFFICIAL" tag mean?
        </h3>
        <p className="ml-2">
          The "UNOFFICIAL*" tag indicates that a game or cycle is not officially
          recognized or supported by its original publishers. This means it is
          created by fans or third parties without the endorsement or active
          support of the official game developers or publishers. As a result,
          the original publishers do not provide support for "UNOFFICIAL*"
          content, and any issues or questions should be directed to the
          creators or the community that developed it.
        </p>

        <h3 className="font-semibold mt-4">How often is this site updated?</h3>
        <p className="ml-2">
          The site is updated promptly upon receiving notifications. Expect
          updates for upcoming seasons within 48h of their availability to the
          public. End dates may experience slight delays as they are less
          prominently advertised by game publishers.
        </p>

        <h3 className="font-semibold mt-4">Do you update the site manually?</h3>
        <p className="ml-2">
          Partialy, although as the sites grows it becomes inevitable.
        </p>

        <h3 className="font-semibold mt-4">
          Would you add a new game to the list?
        </h3>
        <p className="ml-2">
          Absolutely! Please submit an issue on our
          <a
            className="font-semibold hover:opacity-75"
            href="https://github.com/AyronK/arpg-timeline/issues"
            rel="external nofollow"
            target="_blank"
          >
            GitHub page
          </a>
          .
        </p>

        <h3 className="font-semibold mt-4">Would you add a new feature?</h3>
        <p className="ml-2">
          Certainly! Feel free to suggest new features by submitting an issue on
          our{" "}
          <a
            className="font-semibold hover:opacity-75"
            href="https://github.com/AyronK/arpg-timeline/issues"
            rel="external nofollow"
            target="_blank"
          >
            GitHub page
          </a>
          .
        </p>

        <h3 className="font-semibold mt-4">Can I support your work?</h3>
        <p className="ml-2">
          Yes! You can support us by donating a coffee (via the yellow button)
          or contributing to the development of this site (contact us via
          GitHub).
        </p>
      </div>
    </section>
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
