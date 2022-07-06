import type { LinkProps } from '@prismicio/react';
import Image from 'next/future/image';
import Link from 'next/link';
import type { FC } from 'react';
import { ArrowUpRight } from 'react-feather';

const excludedLinks = ['twitter.com', 'linkedin.com', 'haydenbleasel.com'];

const ExternalLinkComponent: FC<LinkProps> = ({ children, href, ...props }) => {
  const isExcluded = excludedLinks.some((excluded) => href.includes(excluded));
  const { host } = new URL(href);

  return (
    <span className="group relative inline-block">
      {!isExcluded && (
        <span className="pointer-events-none absolute left-0 bottom-full ml-[50%] flex h-[203px] w-[316px] -translate-x-2/4 -translate-y-0 rounded-lg border border-gray-50 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:-translate-y-2 group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800">
          <Image
            src={`/screenshots/${host}.png`}
            width={300}
            height={187}
            alt=""
            className="m-0"
          />
        </span>
      )}
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline text-md font-normal text-gray-900 transition-colors hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
        {...props}
      >
        {children}
        <ArrowUpRight
          size={14}
          className="ml-[2px] inline -translate-y-[2px]"
        />
      </Link>
    </span>
  );
};

export default ExternalLinkComponent;
