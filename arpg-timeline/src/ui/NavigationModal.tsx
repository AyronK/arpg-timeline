"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

import { Dialog } from "./Dialog";

export const NavigationModal = ({ children }: PropsWithChildren) => {
    const router = useRouter();
    return (
        <Dialog
            defaultOpen
            onOpenChange={(v) => {
                if (!v) {
                    router.back();
                }
            }}
        >
            {children}
        </Dialog>
    );
};
