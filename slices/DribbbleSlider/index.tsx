import type { FC } from 'react';
import type { SliceComponentProps } from '@prismicio/react';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  MessageSquare,
  ThumbsUp,
} from 'react-feather';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import Image from 'next/future/image';
import Placeholder from '../../components/placeholder';

export type DribbbleSliderProps = {
  slice_type: 'dribbble_slider';
  items: {
    shot: number;
    title?: string;
    image?: string;
    comments?: number;
    likes?: number;
    views?: number;
  }[];
};

const formatNumbers = (num: number) => {
  if (num < 1000) {
    return num;
  }
  if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return `${(num / 1000000).toFixed(1)}m`;
};

const Shot: FC<DribbbleSliderProps['items'][number]> = ({
  shot,
  comments,
  image,
  likes,
  title,
  views,
}) => (
  <Link
    key={shot}
    href={`https://dribbble.com/shots/${shot}`}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative flex w-full max-w-[400px] flex-shrink-0 flex-grow-0 flex-col"
  >
    <div className="flex flex-col overflow-hidden rounded-md bg-white shadow-md transition-all group-hover:shadow-lg dark:bg-gray-800">
      <div className="relative aspect-[4/3] w-full">
        <Placeholder className="absolute z-0 h-full w-full" />
        {image && (
          <Image
            src={image}
            width={400}
            height={300}
            quality={100}
            alt=""
            className="relative z-10 m-0"
          />
        )}
      </div>
      <div className="flex flex-col gap-1 border-t border-gray-100 p-4 dark:border-gray-700">
        <p className="m-0 text-lg font-semibold text-gray-900 line-clamp-1 dark:text-white">
          {title ?? 'Loading'}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-gray-400" />
            <p className="m-0 text-md text-gray-500 dark:text-gray-400">
              {formatNumbers(comments ?? 0)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsUp size={16} className="text-gray-400" />
            <p className="m-0 text-md text-gray-500 dark:text-gray-400">
              {formatNumbers(likes ?? 0)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-gray-400" />
            <p className="m-0 text-md text-gray-500 dark:text-gray-400">
              {formatNumbers(views ?? 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

const DribbbleSlider: FC<SliceComponentProps<DribbbleSliderProps>> = ({
  slice,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: 0,
    loop: false,
    dragFree: false,
    draggable: false,
    align: 'start',
  });

  return (
    <>
      <div className="mt-8" ref={emblaRef}>
        <div className="flex gap-8">{slice.items.map(Shot)}</div>
      </div>
      <div className="mt-8 flex gap-8">
        <div
          className="rounded-full border border-gray-200 p-4 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          onClick={() => emblaApi?.scrollPrev()}
          onKeyDown={() => emblaApi?.scrollPrev()}
          role="button"
          tabIndex={0}
        >
          <ArrowLeft className="text-gray-500 dark:text-gray-400" />
        </div>
        <div
          className="rounded-full border border-gray-200 p-4 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          onClick={() => emblaApi?.scrollNext()}
          onKeyDown={() => emblaApi?.scrollNext()}
          role="button"
          tabIndex={0}
        >
          <ArrowRight className="text-gray-500 dark:text-gray-400" />
        </div>
      </div>
    </>
  );
};

export default DribbbleSlider;
