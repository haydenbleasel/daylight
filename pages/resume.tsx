import type { GetStaticProps } from 'next';
import type {
  GroupField,
  ImageField,
  KeyTextField,
  NumberField,
  PrismicDocumentWithUID,
  RichTextField,
} from '@prismicio/types';
import type { FC } from 'react';
import { useEffect } from 'react';
import Image from 'next/future/image';
import toast from 'react-hot-toast';
import { PrismicLink, PrismicRichText } from '@prismicio/react';
import { getPage, getPages } from '../utils/prismic';
import Layout from '../components/layout';
import { social } from '../utils/social';
import SocialLinks from '../components/socialLinks';
import screenshots from '../utils/screenshots';
import type { WorkPostProps } from './work/[post]';
import type { HomeProps } from '.';

type ResumeProps = {
  data: {
    summary: RichTextField;
    testimonials: GroupField<{
      name: KeyTextField;
      quote: KeyTextField;
      photo: ImageField;
    }>;
    education: GroupField<{
      degree: KeyTextField;
      university: KeyTextField;
      startYear: NumberField;
      endYear: NumberField;
    }>;
  };
  home: HomeProps['data'];
  work: WorkPostProps[];
};

const sortByYear = (postA: WorkPostProps, postB: WorkPostProps) => {
  if (!postA.data.startYear || !postB.data.startYear) {
    return -1;
  }

  return postB.data.startYear - postA.data.startYear;
};

const Resume: FC<ResumeProps> = ({ data, home, work }) => {
  useEffect(() => {
    toast('You can press ⌘P to print this page!', {
      duration: 5 * 60 * 1000,
    });

    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <Layout title="Resume" description="My printable resume." noTitle>
      <div className="flex flex-col gap-8 py-8 sm:py-0">
        <div className="flex items-start gap-8">
          {home.photo.url && (
            <Image
              src={home.photo.url}
              alt="Hayden Bleasel"
              width={64}
              height={64}
              priority
              quality={100}
              className="flex shrink-0 overflow-hidden rounded-full"
            />
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white print:text-lg">
              {home.name}
            </h1>
            <p className="text-md font-normal text-gray-500 dark:text-gray-400 print:text-sm">
              {home.description}
            </p>
            <PrismicLink href={process.env.NEXT_PUBLIC_SITE_URL}>
              <span className="text-sm font-medium underline print:text-xs">
                Visit my website
              </span>
            </PrismicLink>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white print:text-md">
            Summary
          </h2>
          <PrismicRichText field={data.summary} />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white print:text-md">
            Selected Work History
          </h2>
          <div className="flex flex-col gap-4">
            {work.sort(sortByYear).map((job) => (
              <div key={job.uid}>
                <p className="text-md font-semibold text-gray-900 dark:text-white print:text-sm">
                  {job.data.role},{' '}
                  {job.data.slices1.length ? (
                    <PrismicLink document={job}>
                      <span className="text-md font-semibold underline print:text-sm">
                        {job.data.company}
                      </span>
                    </PrismicLink>
                  ) : (
                    job.data.company
                  )}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 print:text-xs">
                  {job.data.startYear} &mdash; {job.data.endYear ?? 'Present'}{' '}
                  in {job.data.location}
                </p>
                <div className="mt-4">
                  <PrismicRichText field={job.data.summary} />
                </div>
              </div>
            ))}
          </div>
          <PrismicLink href={social.find(({ id }) => id === 'linkedin')?.url}>
            <div className="inline-block text-md font-semibold underline print:text-sm">
              View more work history on LinkedIn
            </div>
          </PrismicLink>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white print:text-md">
            Education
          </h2>
          {data.education.map((degree) => (
            <div key={degree.degree}>
              <p className="text-md font-semibold text-gray-900 dark:text-white print:text-sm">
                {degree.degree}, {degree.university}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 print:text-xs">
                {degree.startYear} &mdash; {degree.endYear ?? 'Present'}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white print:text-md">
            Testimonials
          </h2>
          <div className="flex flex-col gap-4">
            {data.testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.name}
                className="border-l-2 border-gray-200 pl-6"
              >
                <p className="text-md text-gray-900 dark:text-white print:text-sm">
                  {testimonial.quote}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  {testimonial.photo.url && (
                    <Image
                      src={testimonial.photo.url}
                      alt=""
                      width={32}
                      height={32}
                      quality={100}
                      priority
                      className="inline-flex overflow-hidden rounded-full"
                    />
                  )}
                  <p className="text-md font-medium text-gray-900 dark:text-white print:text-sm">
                    {testimonial.name}
                  </p>
                </div>
              </blockquote>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white print:text-md">
            Social
          </h2>
          <SocialLinks />
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = (await getPage('resume')) as PrismicDocumentWithUID<
    ResumeProps['data']
  >;
  const { data: home } = (await getPage('home')) as PrismicDocumentWithUID<
    ResumeProps['home']
  >;
  const work = (await getPages('work-post')) as WorkPostProps[];

  await screenshots(data.summary);

  return {
    props: {
      data,
      home,
      work,
    },
  };
};

export default Resume;
