"use client";
import { useEffect } from "react";

// TODO: FIX RICH TEXT
//import { remark } from "remark";
//import html from "remark-html";
import { useToast } from "@/ui/hooks/useToast";

export const SingleToast = ({
    data,
}: {
    data: {
        title: string | null;
        description: string | null;
        withLogo: boolean | null;
        duration: number | null;
        order: number | null;
    } | null;
}) => {
    const { toast } = useToast();
    // TODO: FIX RICH TEXT
    // const renderMarkdown = (markdown: string) =>
    //     remark().use(html).processSync(markdown).toString();

    useEffect(() => {
        if (!data) return;
        toast({
            title: data.title!,
            description: data.description && (
                <div
                    className="rich-text"
                    // TODO: FIX RICH TEXT
                    // dangerouslySetInnerHTML={{
                    //     __html: renderMarkdown(data.description),
                    // }}
                />
            ),
            withLogo: data.withLogo ?? false,
            duration: data.duration ?? undefined,
        });
    }, [data, toast]);

    return null;
};
