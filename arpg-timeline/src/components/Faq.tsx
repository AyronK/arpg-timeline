import { PortableTextBlock } from "next-sanity";

import { RichTextRenderer } from "@/lib/sanity/portableTextComponents";

export const Faq = ({ faq }: { faq: { title: string; content: PortableTextBlock[] }[] }) => {
    return (
        <section className="container flex flex-col gap-4 md:my-16">
            <div className="mx-auto mt-8 max-w-prose">
                <h1 className="mb-8 hidden text-3xl md:block">Frequently Asked Questions</h1>
                <span className="mb-4 block text-3xl md:hidden">FAQ</span>
                <div className="flex flex-col gap-4 md:gap-6">
                    {faq.map((q) => (
                        <div key={q.title}>
                            <h3 className="mb-2 text-2xl leading-tight">{q.title}</h3>
                            <div className="ml-2">
                                <RichTextRenderer content={q.content} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
