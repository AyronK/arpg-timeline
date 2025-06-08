"use client";
import { PortableText } from "next-sanity";
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
        description: any | null;
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
            description: data.description && <PortableText value={data.description} />,
            withLogo: data.withLogo ?? false,
            duration: data.duration ?? undefined,
        });
    }, [data, toast]);

    return null;
};
