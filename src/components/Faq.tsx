import { Button } from "@/ui/Button";

export const Faq = () => (
  <section className="container my-8 flex flex-col gap-4">
    <div>
      <h2 className="sr-only">Support</h2>
      <div className="mx-auto flex max-w-prose flex-col justify-between gap-2 md:flex-row md:gap-8">
        <Button variant={"outline"} size="lg" asChild>
          <a
            href="https://www.buymeacoffee.com/ayron"
            rel="external nofollow noreferrer"
            target="_blank"
          >
            <div className="mr-2 grid h-[1.4rem] w-[1.4rem] place-content-center rounded-full bg-current">
              <img
                src="/assets/bmc-logo-no-background.png"
                className="m-auto h-[1rem] w-[1rem]"
                alt="Buy me a coffee logo"
              />
            </div>
            Support me
          </a>
        </Button>
        <Button variant={"outline"} size="lg" asChild>
          <a
            href="https://github.com/AyronK/arpg-timeline/issues"
            rel="external nofollow noreferrer"
            target="_blank"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              version="1.1"
              data-view-component="true"
              className="mr-2 h-[1.2rem] w-[1.2rem] fill-current"
            >
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
            Request a feature
          </a>
        </Button>
      </div>
    </div>

    <div className="mx-auto mt-8 max-w-prose">
      <h2 className="mb-8 hidden text-3xl md:block">
        Frequently Asked Questions
      </h2>
      <span className="mb-4 block text-3xl md:hidden">FAQ</span>

      <div className="flex flex-col gap-4 md:gap-6">
        <div>
          <h3 className="mb-2 text-xl">What is a season tracker?</h3>
          <p className="ml-2">
            ARPG is a very special genre. The large part of these games&apos;
            community are the same people cycling between new seasons. If you
            are one of those people playing aRPGs for a couple of days or weeks
            each cycle, this site can help you plan your time in regard of new
            season launch dates!
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl">How does aRPG Timeline work?</h3>
          <p className="ml-2">
            We gather the most popular aRPG games and collect information about
            their current and future seasons. These games are then presented in
            a form of timeline widgets. We present launch and end dates of
            relevant seasons for various games.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl">How often is this site updated?</h3>
          <p className="ml-2">
            The site is updated promptly upon receiving official season
            announcement. You can expect updates for upcoming seasons within 48h
            of their availability to the public. End dates may experience slight
            delays as they are less prominently advertised by game publishers.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl">
            Are dates displayed in my local time?
          </h3>
          <p className="ml-2">
            Yes! All dates are displayed in the local time of your machine. You
            can even add an event to your favorite calendar app!
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl">
            What does the &quot;COMMUNITY&quot; tag mean?
          </h3>
          <p className="ml-2">
            The &quot;COMMUNITY&quot; tag indicates that a game or cycle is not
            officially recognized or supported by its original publishers. This
            means it is created by fans or third parties without the endorsement
            or active support of the official game developers or publishers. As
            a result, the original publishers do not provide support for
            &quot;COMMUNITY&quot; content, and any issues or questions should be
            directed to the creators or the community that developed it.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl">How is the website updated?</h3>
          <p className="ml-2">
            We monitor a range of channels, including official websites, wikis,
            Reddit threads, Steam news, and other carefully selected sources.
            Moderators are notified on Discord of anything relevant to current
            or upcoming seasons. To streamline the process, notifications are
            first reviewed by an AI model, reducing manual effort. However, a
            human always performs the final verification.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl">
            Could you add a new game to the list?
          </h3>
          <p className="ml-2">
            Absolutely! As long as it is an aRPG with a seasonal game cycle.
            Please submit your suggestions as an issue on our{" "}
            <a
              className="font-semibold hover:opacity-75"
              href="https://github.com/AyronK/arpg-timeline/issues"
              rel="external nofollow noreferrer"
              target="_blank"
            >
              GitHub page
            </a>{" "}
            or contact me on Dicourd or email, .
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl">Could you add a new feature?</h3>
          <p className="ml-2">
            Certainly! Feel free to suggest new features by submitting an issue
            on our{" "}
            <a
              className="font-semibold hover:opacity-75"
              href="https://github.com/AyronK/arpg-timeline/issues"
              rel="external nofollow noreferrer"
              target="_blank"
            >
              GitHub page
            </a>
            .
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl">Can I support your work?</h3>
          <p className="ml-2">
            Yes! You can support us by donating a coffee (via the yellow button)
            or contributing to the development of this site (contact us via
            GitHub).
          </p>
        </div>
      </div>
    </div>
  </section>
);
