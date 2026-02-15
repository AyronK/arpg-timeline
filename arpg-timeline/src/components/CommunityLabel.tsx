import Link from "next/link";

const DISCLAIMER_TITLE =
    "Unofficial community-run game. Not supported by publishers. Use at your own risk.";

export const CommunityLabel = () => {
    return (
        <Link
            href="/community-launchers"
            className="text-foreground font-heading flex cursor-pointer flex-row items-center justify-center gap-0.5 rounded-md border border-yellow-400/75 bg-yellow-400/15 px-1 py-[1px] text-xs leading-4 font-semibold opacity-80 transition-opacity select-none hover:opacity-100"
            title={DISCLAIMER_TITLE}
            data-sa-click="community-label-disclaimer"
        >
            community
        </Link>
    );
};
