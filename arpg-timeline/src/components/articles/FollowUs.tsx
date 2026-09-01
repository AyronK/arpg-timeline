import Link from "next/link";
import { FaDiscord } from "react-icons/fa6";

const LINKS = [
    {
        href: process.env.NEXT_PUBLIC_DISCORD_URL,
        label: "Discord",
        Icon: FaDiscord,
        sa: "follow-discord",
    },
].filter((link) => Boolean(link.href));

export const FollowUs = ({ className }: { className?: string }) => {
    if (LINKS.length === 0) return null;

    return (
        <section className={className}>
            <p className="font-heading text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                Follow us
            </p>
            <div className="flex gap-2">
                {LINKS.map(({ href, label, Icon, sa }) => (
                    <Link
                        key={label}
                        href={href as string}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        aria-label={label}
                        data-sa-click={sa}
                        className="bg-card text-foreground hover:border-border hover:text-primary flex size-10 items-center justify-center rounded-lg border transition-all hover:shadow-sm"
                    >
                        <Icon className="size-4" aria-hidden />
                    </Link>
                ))}
            </div>
        </section>
    );
};
