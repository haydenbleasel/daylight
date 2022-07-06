import type { GetStaticPaths, GetStaticProps } from 'next';
import type { FC } from 'react';
import type {
  EmbedField,
  ImageFieldImage,
  KeyTextField,
  PrismicDocumentWithUID,
  RichTextField,
} from '@prismicio/types';
import { PrismicRichText } from '@prismicio/react';
import { format, parseISO } from 'date-fns';
import Image from 'next/future/image';
import Layout from '../components/layout';
import { getPage, getPages } from '../utils/prismic';
import Video from '../components/video';
import screenshots from '../utils/screenshots';

type LandingPageProps = {
  data: {
    title: KeyTextField;
    description: KeyTextField;
    coverImage: ImageFieldImage;
    coverVideo: EmbedField;
    content: RichTextField;
  };
  last_publication_date: string;
};

const LandingPage: FC<LandingPageProps> = ({ data, last_publication_date }) => (
  <Layout title={data.title} description={data.description}>
    <div className="flex flex-col gap-8">
      <div className="flex animate-enter flex-col gap-1 opacity-0 animation-delay-100">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated at{' '}
          {format(parseISO(last_publication_date), 'MMM dd, yyyy')}{' '}
        </p>
      </div>
      {data.coverImage.url && (
        <Image
          src={data.coverImage.url}
          alt={data.coverImage.alt ?? ''}
          width={480}
          height={
            480 *
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
      <div className="animate-enter opacity-0 animation-delay-300">
        <PrismicRichText field={data.content} />
      </div>
    </div>
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data, last_publication_date } = (await getPage(
    params?.uid as string,
    'landing-page'
  )) as PrismicDocumentWithUID<LandingPageProps['data']>;

  await screenshots(data.content);

  return {
    props: {
      data,
      last_publication_date,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = (await getPages('landing-page')) as PrismicDocumentWithUID[];

  const paths = pages.map(({ uid }) => ({
    params: {
      uid,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export default LandingPage;
