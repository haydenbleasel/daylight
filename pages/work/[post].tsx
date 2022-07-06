import type { GetStaticPaths, GetStaticProps } from 'next';
import type { FC } from 'react';
import type {
  EmbedField,
  ImageField,
  KeyTextField,
  NumberField,
  PrismicDocumentWithUID,
  RichTextField,
  SliceZone,
} from '@prismicio/types';
import { SliceZone as SliceZoneComponent } from '@prismicio/react';
import Image from 'next/future/image';
import Layout from '../../components/layout';
import { getPage, getPages } from '../../utils/prismic';
import { components } from '../../slices';
import Video from '../../components/video';
import screenshots from '../../utils/screenshots';

export type WorkPostProps = PrismicDocumentWithUID<{
  role: KeyTextField;
  company: KeyTextField;
  description: KeyTextField;
  coverImage: ImageField;
  coverVideo: EmbedField;
  startYear: NumberField;
  endYear: NumberField;
  location: KeyTextField;
  summary: RichTextField;
  slices1: SliceZone;
}>;

const WorkPost: FC<WorkPostProps> = ({ data }) => (
  <Layout
    title={`${data.role ?? ''} at ${data.company ?? ''}`}
    description={data.description}
  >
    <div className="flex flex-col gap-8">
      <div className="flex animate-enter flex-col gap-1 opacity-0 animation-delay-100">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {data.description}
        </p>
        <p className="animate-enter text-xs text-gray-500 opacity-0 animation-delay-200 dark:text-gray-400">
          {data.startYear} &mdash; {data.endYear ?? 'Present'}, {data.location}.
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
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const uid = params?.post as string;
  const posts = await getPage(uid, 'work-post');
  const post = posts as PrismicDocumentWithUID<WorkPostProps['data']>;

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
  const workPosts = (await getPages('work-post')) as PrismicDocumentWithUID<
    WorkPostProps['data']
  >[];

  const paths = workPosts
    .filter(({ data }) => data.slices1.length)
    .map(({ uid }) => ({
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
