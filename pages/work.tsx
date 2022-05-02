import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import groupBy from 'lodash.groupby';
import type {
  GroupField,
  KeyTextField,
  LinkField,
  NumberField,
  PrismicDocumentWithUID,
  RichTextField,
} from '@prismicio/types';
import { PrismicLink } from '@prismicio/react';
import Layout from '../components/layout';
import { docResolver, getPage } from '../utils/prismic';

export type WorkProps = {
  data: {
    jobs: GroupField<{
      title: KeyTextField;
      company: KeyTextField;
      link: LinkField;
      description: RichTextField;
      startYear: NumberField;
      endYear: NumberField;
      location: KeyTextField;
    }>;
  };
};

const Work: FC<WorkProps> = ({ data }) => {
  const years = groupBy(data.jobs, (job) => job.startYear);

  return (
    <Layout title="Work" description="A list of roles I've had over the years.">
      <div className="mt-4 flex flex-col gap-8">
        {Object.keys(years)
          .reverse()
          .map((startYear, index) => (
            <div
              className="flex animate-enter gap-8 opacity-0"
              key={startYear}
              style={{
                animationDelay: `${(index + 2) * 100}ms`,
              }}
            >
              <p className="flex-0 w-24 text-sm text-gray-500 dark:text-gray-400">
                {startYear}
              </p>
              <div className="flex flex-1 flex-col gap-4">
                {years[startYear].map((job) => (
                  <div key={job.company}>
                    <p className="text-md text-gray-900 dark:text-white">
                      {job.title},{' '}
                      {docResolver(job.link) ? (
                        <PrismicLink field={job.link}>
                          <span className="underline">{job.company}</span>
                        </PrismicLink>
                      ) : (
                        job.company
                      )}
                    </p>
                    <p className="flex-0 text-sm text-gray-500 dark:text-gray-400">
                      {job.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = (await getPage('work')) as PrismicDocumentWithUID;

  return {
    props: {
      data,
    },
  };
};

export default Work;
