import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";

type AnchorProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export type MaybeLinkWrapperProps = Replace<
  AnchorProps,
  "href",
  string | undefined | null
>;

export const MaybeLinkWrapper = ({
  href,
  children,
  ...rest
}: MaybeLinkWrapperProps) => {
  if (!href) {
    return children;
  }

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
};
