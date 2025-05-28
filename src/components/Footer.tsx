import { sa_event } from "@/lib/sa_event";

export const Footer = () => (
  <footer className="border-foreground bg-card mt-12 border-t px-4 py-4">
    <div className="flex flex-col justify-evenly gap-6 md:flex-row">
      <div className="flex flex-row gap-1">
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

      <div className="flex flex-row gap-1">
        <a
          className="font-semibold hover:opacity-75"
          href="/privacy"
          rel="self"
        >
          Privacy & GDPR
        </a>
      </div>

      <div className="flex flex-row gap-1">
        <a
          className="font-semibold hover:opacity-75"
          href="https://discord.gg/39mTbjkePg"
          rel="noopener noreferrer"
          onClick={() => sa_event("discord-click")}
        >
          Discord
        </a>
      </div>

      <div className="flex flex-row gap-1">
        <a
          className="font-semibold hover:opacity-75"
          href="mailto:arpgtimeline@ayronk.com"
          rel="noopener noreferrer"
        >
          Contact
        </a>
      </div>

      <div className="flex flex-row gap-1">
        &copy; <span id="currentYear">{new Date().getFullYear()}</span>-
        <a
          className="font-semibold hover:opacity-75"
          href="https://github.com/AyronK"
          rel="external nofollow noreferrer"
          target="_blank"
          aria-label="Author's Github Profile - AyronK"
        >
          AyronK @ GitHub
        </a>
      </div>
    </div>
  </footer>
);
