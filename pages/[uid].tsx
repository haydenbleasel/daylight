import type { GetStaticPaths, GetStaticProps } from 'next';
import type { FC } from 'react';
import type {
  EmbedField,
  ImageFieldImage,
  KeyTextField,
  PrismicDocumentWithUID,
} from '@prismicio/types';
import type { SliceZoneComponents, SliceZoneProps } from '@prismicio/react';
import { SliceZone } from '@prismicio/react';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import Layout from '../components/layout';
import { getPages, getTemplate } from '../utils/prismic';
import { components } from '../slices';
import Video from '../components/video';

type LandingPageProps = {
  data: {
    title: KeyTextField;
    description: KeyTextField;
    coverImage: ImageFieldImage;
    coverVideo: EmbedField;
    slices1: SliceZoneProps['slices'];
  };
  last_publication_date: string;
};

const LandingPage: FC<LandingPageProps> = ({ data, last_publication_date }) => (
  <Layout title={data.title} description={data.description}>
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated at{' '}
          {format(parseISO(last_publication_date), 'MMM dd, yyyy')}{' '}
        </p>
      </div>
      {data.coverImage.url && (
        <div className="flex overflow-hidden rounded-sm">
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
          />
        </div>
      )}
      {data.coverVideo.embed_url && (
        <Video data={data.coverVideo} loop playsinline controls={false} muted />
      )}
      <div className="flex flex-col gap-8">
        <SliceZone
          slices={data.slices1}
          components={components as unknown as SliceZoneComponents}
        />
      </div>
    </div>
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({
  params,
  previewData,
}) => {
  const { data, last_publication_date } = (await getTemplate(
    params?.uid as string,
    'landing-page',
    previewData
  )) as PrismicDocumentWithUID;

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
