import { add, format } from 'date-fns';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import colors from 'tailwindcss/colors';
import Layout from '../components/layout';

type CommitsResponse = {
  commits: Record<string, number>;
};

type Contribution = {
  date: Date;
  count: number;
};

const fetcher = async (url: string): Promise<CommitsResponse> => {
  const response = await fetch(url);
  const data = (await response.json()) as CommitsResponse;

  return data;
};

const getColor = (count: number, total: number): string => {
  const ratio = Math.min(Number((count / total).toFixed(1)) * 1000, 900);

  return colors.green[ratio as unknown as keyof typeof colors.green];
};

const Code: FC = () => {
  const response = useSWR<CommitsResponse, Error>(
    '/api/github-commits',
    fetcher
  );
  const commits = response.data?.commits;
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const mostContributions = contributions.reduce(
    (acc, curr) => (curr.count > acc ? curr.count : acc),
    0
  );

  useEffect(() => {
    if (commits) {
      const newContributions: Contribution[] = [];
      const keys = Object.keys(commits);
      let start = keys[keys.length - 1];

      while (new Date(start) < new Date()) {
        const dailyCommits = start in commits ? commits[start] : 0;

        newContributions.push({
          date: new Date(start),
          count: dailyCommits,
        });

        start = format(add(new Date(start), { days: 1 }), 'yyyy-MM-dd');
      }

      setContributions(newContributions);
    }
  }, [commits]);

  return (
    <div>
      <Layout title="Code" description="let's get busy">
        <div className="grid grid-cols-11 gap-1">
          {contributions.map(({ date, count }) => (
            <div
              key={date.toISOString()}
              className="aspect-square rounded-sm bg-gray-50"
              style={{ background: getColor(count, mostContributions) }}
            />
          ))}
        </div>
      </Layout>
    </div>
  );
};

export default Code;
