import type { LinkProps } from '@prismicio/react';
import Image from 'next/future/image';
import Link from 'next/link';
import type { FC } from 'react';
import { ArrowUpRight } from 'react-feather';
import { useAsync, useMountEffect } from '@react-hookz/web';
import type { ScreenshotResponse } from '../pages/api/screenshot';
import Placeholder from './placeholder';

const excludedLinks = ['twitter.com', 'linkedin.com', 'haydenbleasel.com'];

const ExternalLinkComponent: FC<LinkProps> = ({ children, href, ...props }) => {
  const isExcluded = excludedLinks.some((excluded) => href.includes(excluded));
  const [screenshot, { execute }] = useAsync(async () => {
    const response = await fetch('/api/screenshot', {
      method: 'POST',
      body: JSON.stringify({
        url: href,
      }),
    });

    const data = (await response.json()) as ScreenshotResponse;

    return data;
  });

  useMountEffect(async () => {
    if (!isExcluded) {
      await execute();
    }
  });

  return (
    <span className="group relative inline-block">
      {!isExcluded && !screenshot.error && !screenshot.result?.error && (
        <span className="pointer-events-none absolute left-0 bottom-full ml-[50%] flex h-[205px] w-[318px] -translate-x-2/4 -translate-y-0 rounded-lg border border-gray-50 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:-translate-y-2 group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800">
          {screenshot.result?.image ? (
            <Image
              src={`data:image/png;base64,${screenshot.result.image}`}
              width={300}
              height={187}
              alt=""
              className="m-0"
            />
          ) : (
            <Placeholder className="h-full w-full rounded-md" />
          )}
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
