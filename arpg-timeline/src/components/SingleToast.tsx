"use client";
import { PortableText } from "next-sanity";
import { useEffect } from "react";

import { SanityToast } from "@/lib/cms/queries/indexQuery";
import { useToast } from "@/ui/hooks/useToast";

export const SingleToast = ({ data }: { data: SanityToast }) => {
    const { toast } = useToast();

    useEffect(() => {
        if (!data) return;
        toast({
            title: data.title!,
            description: data.description && <PortableText value={data.description} />,
            withLogo: data.withLogo ?? false,
            duration: data.duration ?? 5000,
        });
    }, [data, toast]);

    return null;
};
