import { cn } from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react";
import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";

type AnchorProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export type MaybeLinkWrapperProps = Replace<
  AnchorProps,
  "href",
  string | undefined | null
> & { noIcon?: boolean | undefined; className?: string | undefined };

export const MaybeLinkWrapper = ({
  href,
  children,
  noIcon,
  className,
  ...rest
}: MaybeLinkWrapperProps) => {
  if (!href) {
    return children;
  }

  return (
    <a
      href={href}
      {...rest}
      className={cn(
        className,
        "flex cursor-pointer flex-row flex-nowrap gap-1 transition-all ease-in-out hover:brightness-125",
      )}
    >
      {children}
      {!noIcon && (
        <ExternalLinkIcon className="mb-auto h-[0.75em] w-[0.75em] text-current" />
      )}
    </a>
  );
};
