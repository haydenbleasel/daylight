import type { FC } from 'react';
import useSWR from 'swr';
import type { NeutralResponse } from '../../pages/api/neutral';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = (await response.json()) as NeutralResponse;

  return data;
};

const NeutralData: FC = () => {
  const { data } = useSWR<NeutralResponse>('/api/neutral', fetcher);

  const metrics = [
    { label: 'Trees planted', value: data?.treeCount },
    { label: 'Tonnes of CO₂e offset', value: data?.offsetAmount },
    { label: 'Average rating', value: data?.averageRating },
    { label: 'Reforestation programs', value: data?.programCount },
    { label: 'Latest version', value: data?.latestVersion },
  ];

  return (
    <div className="grid gap-8 rounded-sm bg-gray-100 p-8 dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <div className="relative inline-flex h-3 w-3">
          <span className="absolute inset-0 inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-75 dark:bg-success-500" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-success-500 dark:bg-success-400" />
        </div>
        <p className="text-md text-gray-500 dark:text-gray-400">Live data</p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        {metrics.map((metric, index) => (
          <div key={index}>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {metric.value}
            </p>
            <p className="text-md text-gray-500 dark:text-gray-400">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeutralData;