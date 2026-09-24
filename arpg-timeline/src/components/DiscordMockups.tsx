import { Bell, CalendarDays, Ellipsis, Link2, MapPin, Swords, UsersRound } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Logo } from "./Logo";

// Static HTML recreations of Discord UI, used instead of screenshots

const BotAvatar = ({ className }: { className?: string }) => (
    <span
        className={cn(
            "inline-block shrink-0 rounded-full bg-[#111214] p-[10%] text-[#dbdee1]",
            className,
        )}
    >
        <Logo className="h-full w-full" />
    </span>
);

const Embed = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div
        aria-hidden
        className={cn(
            "w-full max-w-xl rounded-[4px] border-l-4 border-[#5865f2] bg-[#2b2d31] p-4 text-left text-sm leading-[1.375] text-[#dbdee1] select-none md:text-[15px]",
            className,
        )}
    >
        {children}
    </div>
);

const EmbedTitle = ({ children }: { children: ReactNode }) => (
    <div className="mb-2 text-base font-semibold text-[#f2f3f5] md:text-[17px]">{children}</div>
);

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
    <span>
        <span className="font-semibold text-[#f2f3f5]">{label}:</span> {children}
    </span>
);

const EmbedLink = ({ children }: { children: ReactNode }) => (
    <span className="text-[#00a8fc]">{children}</span>
);

export const DiscordEventMockup = () => (
    <div
        aria-hidden
        className="w-full max-w-xl overflow-hidden rounded-lg border border-[#3f4147] bg-[#2b2d31] text-left text-[#dbdee1] select-none"
    >
        <div className="grid grid-cols-[2fr_3fr] bg-[#18191c]">
            <div className="grid place-content-center border-r border-white/10 p-4">
                <div className="font-heading flex flex-col items-center text-center leading-none">
                    <Swords className="mb-1.5 h-5 w-5 text-amber-500/80 md:h-6 md:w-6" />
                    <span className="text-base font-bold tracking-wider text-amber-100 md:text-2xl">
                        Ashen
                    </span>
                    <span className="text-[10px] tracking-[0.3em] text-amber-500/80 uppercase md:text-xs">
                        Kingdoms
                    </span>
                </div>
            </div>
            <div className="flex min-w-0 flex-col justify-center gap-1 p-4">
                <div className="font-heading flex items-center gap-2 border-b border-white/10 pb-1.5 text-xs text-[#dbdee1] md:text-sm">
                    <Logo className="h-5 w-5 shrink-0" />
                    aRPG Timeline
                </div>
                <div className="font-heading truncate text-sm font-bold text-white md:text-lg">
                    Ashen Kingdoms
                </div>
                <div className="font-heading truncate text-[10px] text-[#b5bac1] md:text-xs">
                    Season 5 - Rise of the Frost
                </div>
            </div>
        </div>
        <div className="border-b border-[#3f4147] px-4 pt-3 pb-4">
            <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-semibold text-[#dbdee1] md:text-sm">
                    <CalendarDays className="h-5 w-5 text-[#5865f2]" />
                    Thu Oct 1. 18:00
                </span>
                <span className="flex items-center gap-2">
                    <BotAvatar className="h-5 w-5 opacity-70" />
                    <span className="flex items-center gap-1 rounded-full bg-[#1e1f22] px-2 py-0.5 text-xs font-semibold">
                        <UsersRound className="h-3 w-3" />0
                    </span>
                </span>
            </div>
            <div className="mb-1 text-base font-semibold text-[#f2f3f5] md:text-lg">
                Ashen Kingdoms: Season 5 - Rise of the Frost
            </div>
            <div className="flex items-center gap-1 text-xs md:text-sm">
                <Link2 className="h-4 w-4 -rotate-45 text-[#b5bac1]" />
                <EmbedLink>Season info</EmbedLink>
                <EmbedLink>Tracked by aRPG Timeline</EmbedLink>
            </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-3">
            <span className="flex min-w-0 items-center gap-2 truncate text-xs md:text-sm">
                <MapPin className="h-4 w-4 shrink-0 fill-[#dbdee1] text-[#2b2d31]" />
                aRPG Timeline
            </span>
            <span className="flex shrink-0 items-center gap-2 text-xs font-medium md:text-sm">
                <span className="grid h-8 w-8 place-content-center rounded-[4px] bg-[#35373c]">
                    <Ellipsis className="h-4 w-4" />
                </span>
                <span className="hidden items-center gap-1.5 rounded-[4px] bg-[#35373c] px-3 py-1.5 sm:flex">
                    <Link2 className="h-4 w-4 -rotate-45" />
                    Copy link
                </span>
                <span className="flex items-center gap-1.5 rounded-[4px] bg-[#35373c] px-3 py-1.5">
                    <Bell className="h-4 w-4 fill-current" />
                    Interested
                </span>
            </span>
        </div>
    </div>
);

export const DiscordGameConfigMockup = () => (
    <Embed>
        <EmbedTitle>🎮 Game Configuration Manager</EmbedTitle>
        <p className="mb-2">Select games below to toggle their notification status.</p>
        <div className="mb-2 grid grid-cols-2 gap-x-4">
            <div>
                <div className="font-semibold text-[#f2f3f5]">📊 Current Status</div>
                <div>
                    <Field label="Enabled Games">15/30</Field>
                </div>
                <div>
                    <Field label="Tracking">Active</Field>
                </div>
            </div>
            <div>
                <div className="font-semibold text-[#f2f3f5]">📄 Page Navigation</div>
                <div>
                    <Field label="Current Page">1/2</Field>
                </div>
                <div>
                    <Field label="Games Shown">25</Field>
                </div>
            </div>
        </div>
        <div className="font-semibold text-[#f2f3f5]">💡 How to Use</div>
        <div>• Use the dropdown to toggle individual games</div>
        <div>• Use buttons for bulk enable/disable</div>
        <div className="mb-3">• Green ✅ = enabled, Red ❌ = disabled</div>
        <div className="flex items-center gap-2 text-xs font-medium">
            <Image
                src="/assets/discord-bot/ayronk.png"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 rounded-full"
            />
            Session expires in 120s • Use /arpg-status to view current settings
        </div>
    </Embed>
);

const seasons = [
    { title: "Ashen Kingdoms: Season 5 - Rise of the Frost", starts: "in 7 days" },
    { title: "Hollow Depths: Season 12 - The Sunken Crown", starts: "in 8 days" },
];

export const DiscordSeasonsMockup = () => (
    <Embed>
        <EmbedTitle>🎮 Active aRPG Seasons</EmbedTitle>
        <p className="mb-2">Currently active and upcoming Action RPG seasons</p>
        <div className="flex flex-col gap-2">
            {seasons.map((s) => (
                <div key={s.title}>
                    <div className="font-semibold text-[#f2f3f5]">🔮 {s.title}</div>
                    <div>
                        📅 <span className="font-semibold text-[#f2f3f5]">Starts:</span>{" "}
                        <span className="rounded-[3px] bg-[#3f4147] px-1">{s.starts}</span>
                    </div>
                    <div>
                        🏁 <Field label="Ends">TBD</Field>
                    </div>
                    <div>
                        🎯 <Field label="Status">Upcoming</Field>
                    </div>
                    <div>
                        🔗 🌐 <EmbedLink>Timeline</EmbedLink>
                    </div>
                </div>
            ))}
        </div>
    </Embed>
);
