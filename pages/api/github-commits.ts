import { format, parseISO, sub } from 'date-fns';
import type { NextApiHandler } from 'next';

type GitHubEvent = {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    display_login: string;
    gravatar_id: string;
    url: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: {
    action: string;
  };
  public: true;
  created_at: string;
};

const fetchCommits = async (page = 1) => {
  const response = await fetch(
    `https://api.github.com/users/haydenbleasel/events?per_page=100&page=${page}`,
    {
      headers: {
        accept: 'application/vnd.github.v3+json',
        Authorization: `token ${process.env.GITHUB_TOKEN ?? ''}`,
      },
    }
  );

  const data = (await response.json()) as GitHubEvent[] | { message: string };

  if ('message' in data) {
    throw new Error(data.message);
  }

  const commits = data.filter((event) => event.type === 'PushEvent');

  return commits;
};

const handler: NextApiHandler = async (req, res) => {
  try {
    let page = 1;
    const commits = await fetchCommits(page);
    const endDate = new Date(commits[0].created_at);
    const startDate = sub(endDate, { months: 1 });

    while (commits[commits.length - 1].created_at > startDate.toISOString()) {
      page += 1;

      try {
        // eslint-disable-next-line no-await-in-loop
        const newCommits = await fetchCommits(page);

        const filteredCommits = newCommits.filter(
          (commit) => commit.created_at > startDate.toISOString()
        );

        commits.push(...filteredCommits);
      } catch (error) {
        break;
      }
    }

    // Number of commits by day
    const commitsByDay = commits.reduce<Record<string, number>>(
      (acc, commit) => {
        const date = parseISO(commit.created_at);
        const day = format(date, 'yyyy-MM-dd');

        if (acc[day]) {
          acc[day] += 1;
        } else {
          acc[day] = 1;
        }
        return acc;
      },
      {}
    );

    res.status(200).json({ commits: commitsByDay });
  } catch (error) {
    const message = error instanceof Error ? error.message : (error as string);
    res.status(500).json({ error: message });
  }
};

export default handler;
