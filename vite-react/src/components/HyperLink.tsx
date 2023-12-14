import React from 'react';

import type { Link as LinkType } from '../types/Link';

export type HyperLinkProps = {
  link: LinkType,
  children: React.ReactNode,
  className?: string,
  hoverClassName?: string | null | undefined,
  startEnhancer?: React.ReactNode,
  formatted?: boolean,
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void,
};

export default function HyperLink({
  link,
  children,
  className = '',
  hoverClassName = null,
  startEnhancer = null,
  formatted = true,
  onClick = (): void => { },
}: HyperLinkProps): React.ReactElement | null {

  if (!link?.url) return null;

  const hoverClasses = hoverClassName || 'hover:text-red-600';
  const commonClasses = formatted ? `transition duration-200 ease-in-out whitespace-nowrap flex flex-row items-center ${hoverClasses}` : '';
  const caption = link?.caption || undefined;
  const separator = startEnhancer ? <span className="w-1" /> : null;

  return (
    <a
      href={link.url}
      className={`${commonClasses} ${className}`}
      onClick={onClick}
      title={caption}
      style={{ fontWeight: 400 }}
    >
      {formatted && startEnhancer}
      {formatted && separator}
      {children}
    </a>
  );
};
