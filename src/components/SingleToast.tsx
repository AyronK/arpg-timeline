import { useEffect } from "react";
import { remark } from "remark";
import { useToast } from "@/ui/hooks/useToast";
import html from "remark-html";

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
  const renderMarkdown = (markdown: string) =>
    remark().use(html).processSync(markdown).toString();

  useEffect(() => {
    if (!data) return;
    toast({
      title: data.title!,
      description: data.description && (
        <div
          className="rich-text"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(data.description),
          }}
        />
      ),
      withLogo: data.withLogo ?? false,
      duration: data.duration ?? undefined,
    });
  }, []);

  return null;
};
