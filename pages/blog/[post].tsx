import type { GetStaticPaths, GetStaticProps } from 'next';
import type { FC } from 'react';
import type {
  DateField,
  EmbedField,
  ImageField,
  KeyTextField,
  PrismicDocumentWithUID,
  RichTextField,
  SliceZone,
} from '@prismicio/types';
import { format, parse, parseISO } from 'date-fns';
import { SliceZone as SliceZoneComponent } from '@prismicio/react';
import Image from 'next/future/image';
import { useRouter } from 'next/router';
import { ArticleJsonLd } from 'next-seo';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import Layout from '../../components/layout';
import { getPage, getPages } from '../../utils/prismic';
import { components } from '../../slices';
import Video from '../../components/video';
import screenshots from '../../utils/screenshots';

type PostProps = PrismicDocumentWithUID<{
  title: KeyTextField;
  description: KeyTextField;
  coverImage: ImageField;
  coverVideo: EmbedField;
  custom_publish_date: DateField;
  slices1: SliceZone;
}>;

const WorkPost: FC<PostProps> = ({
  data,
  last_publication_date,
  first_publication_date,
}) => {
  const { asPath } = useRouter();
  const publishedAt = data.custom_publish_date
    ? parse(data.custom_publish_date, 'yyyy-MM-dd', new Date()).toISOString()
    : first_publication_date;
  const shareUrl = new URL(asPath, process.env.NEXT_PUBLIC_SITE_URL ?? '').href;

  return (
    <Layout title={data.title} description={data.description}>
      <ArticleJsonLd
        url={shareUrl}
        title={data.title ?? ''}
        images={data.coverImage.url ? [data.coverImage.url] : []}
        datePublished={publishedAt}
        dateModified={last_publication_date}
        authorName={[]}
        publisherName="Corellium"
        publisherLogo={
          new URL(
            '/android-chrome-512x512.png',
            process.env.NEXT_PUBLIC_SITE_URL ?? ''
          ).href
        }
        description={data.description ?? ''}
      />
      <div className="flex flex-col gap-8">
        <div className="flex animate-enter flex-col gap-1 opacity-0 animation-delay-100">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Published {format(parseISO(publishedAt), 'MMM dd, yyyy')}{' '}
          </p>
        </div>
        {data.coverImage.url && (
          <Image
            src={data.coverImage.url}
            alt={data.coverImage.alt ?? ''}
            width={640}
            height={
              640 *
              (data.coverImage.dimensions.height /
                data.coverImage.dimensions.width)
            }
            priority
            quality={100}
            className="flex animate-enter overflow-hidden rounded-sm opacity-0 animation-delay-200"
          />
        )}
        {data.coverVideo.embed_url && (
          <div className="animate-enter opacity-0 animation-delay-200">
            <Video
              data={data.coverVideo}
              loop
              playsinline
              controls={false}
              muted
            />
          </div>
        )}
        <div className="prose animate-enter opacity-0 animation-delay-300 dark:prose-invert">
          <SliceZoneComponent slices={data.slices1} components={components} />
        </div>
      </div>
      <div className="bottom-0 left-0 right-0 flex animate-enter items-center justify-between gap-4 border-t border-gray-200 bg-white py-3 text-gray-500 opacity-0 animation-delay-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 sm:fixed sm:px-4">
        <p className="text-md font-semibold text-gray-900 line-clamp-1 dark:text-white">
          Share this article
        </p>
        <div className="flex items-center">
          <FacebookShareButton url={shareUrl}>
            <span className="flex items-center gap-2 rounded-md py-[10px] px-[10px] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 sm:py-1">
              <FacebookIcon className="rounded-full" size={16} />
              <span className="hidden text-md text-gray-500 dark:text-gray-400 sm:block">
                Facebook
              </span>
            </span>
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl}>
            <span className="flex items-center gap-2 rounded-md py-[10px] px-[10px] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 sm:py-1">
              <TwitterIcon className="rounded-full" size={16} />
              <span className="hidden text-md text-gray-500 dark:text-gray-400 sm:block">
                Twitter
              </span>
            </span>
          </TwitterShareButton>
          <LinkedinShareButton url={shareUrl}>
            <span className="flex items-center gap-2 rounded-md py-[10px] px-[10px] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 sm:py-1">
              <LinkedinIcon className="rounded-full" size={16} />
              <span className="hidden text-md text-gray-500 dark:text-gray-400 sm:block">
                LinkedIn
              </span>
            </span>
          </LinkedinShareButton>
          <TelegramShareButton url={shareUrl}>
            <span className="flex items-center gap-2 rounded-md py-[10px] px-[10px] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 sm:py-1">
              <TelegramIcon className="rounded-full" size={16} />
              <span className="hidden text-md text-gray-500 dark:text-gray-400 sm:block">
                Telegram
              </span>
            </span>
          </TelegramShareButton>
          <RedditShareButton url={shareUrl}>
            <span className="flex items-center gap-2 rounded-md py-[10px] px-[10px] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 sm:py-1">
              <RedditIcon className="rounded-full" size={16} />
              <span className="hidden text-md text-gray-500 dark:text-gray-400 sm:block">
                Reddit
              </span>
            </span>
          </RedditShareButton>
          <EmailShareButton url={shareUrl}>
            <span className="flex items-center gap-2 rounded-md py-[10px] px-[10px] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 sm:py-1">
              <EmailIcon className="rounded-full" size={16} />
              <span className="hidden text-md text-gray-500 dark:text-gray-400 sm:block">
                Email
              </span>
            </span>
          </EmailShareButton>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const uid = params?.post as string;
  const posts = await getPage(uid, 'case-study');

  const post = posts as PrismicDocumentWithUID<PostProps['data']>;

  await Promise.all(
    post.data.slices1
      .filter((slice) => slice.slice_type === 'rich_text')
      .map(async (slice) => screenshots(slice.primary.content as RichTextField))
  );

  return {
    props: post,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const caseStudies = (await getPages('case-study')) as PrismicDocumentWithUID<
    PostProps['data']
  >[];

  const paths = caseStudies.map(({ uid }) => ({
    params: {
      post: uid,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export default WorkPost;
