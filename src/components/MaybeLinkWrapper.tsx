import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";

type AnchorProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

type Identity<T> = { [P in keyof T]: T[P] };
type Replace<T, K extends keyof T, TReplace> = Identity<
  Pick<T, Exclude<keyof T, K>> & {
    [P in K]: TReplace;
  }
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
