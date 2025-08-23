import { CodeXml, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { SiObsstudio } from "react-icons/si";

import { Button } from "@/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/ui/DropdownMenu";

export function GameMenu({ game }: { game: string }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"link"}
                    className="h-[32px]! w-[32px]! transition-all duration-200 hover:scale-110 md:h-[40px]! md:w-[40px]!"
                    size={"icon"}
                    aria-label="Share"
                    data-sa-click="game-menu"
                >
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Link href={`/docs/html/${game}`} target="_blank" rel="noopener noreferrer">
                    <DropdownMenuItem
                        aria-label="Share on Discord"
                        data-sa-click={`${game}-html-docs`}
                    >
                        <CodeXml className="mr-2 h-4 w-4" />
                        HTML
                    </DropdownMenuItem>
                </Link>
                <Link href={`/docs/obs/${game}`} target="_blank" rel="noopener noreferrer">
                    <DropdownMenuItem
                        aria-label="Share on Discord"
                        data-sa-click={`${game}-obs-docs`}
                    >
                        <SiObsstudio className="mr-2 h-4 w-4" />
                        OBS
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
