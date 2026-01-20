import { PortableTextBlock } from "next-sanity";

export const faqQuery = `{
  "faq": *[_type == "faq"] | order(order asc){
    title,
    content,
    order
  }
}`;

export interface Faq {
    title: string;
    content: PortableTextBlock[];
    order: number;
}

export interface FaqQueryResult {
    faq: Faq[];
}
