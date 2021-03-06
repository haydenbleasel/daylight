import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import type { KeyTextField, PrismicDocumentWithUID } from '@prismicio/types';
import { Star } from 'react-feather';
import { getPage } from '../utils/prismic';
import Layout from '../components/layout';
import type { AchievementProps, SteamGame } from '../utils/steam';
import { getGames } from '../utils/steam';
import List from '../components/list';

type ProjectsProps = {
  data: {
    title: KeyTextField;
    description: KeyTextField;
  };
  games: {
    game: SteamGame;
    achievements: AchievementProps[];
  }[];
};

const isPerfectGame = (game: ProjectsProps['games'][number]) => {
  if (!game.achievements.length) {
    return false;
  }

  const isPerfect =
    game.achievements.filter(({ achieved }) => Boolean(achieved)).length ===
    game.achievements.length;

  return isPerfect;
};

const Achievements: FC<{ data: AchievementProps[] }> = ({ data }) => {
  const completedAchievements = data.filter(({ achieved }) =>
    Boolean(achieved)
  );
  const isPerfect = completedAchievements.length === data.length;

  return (
    <span
      className={`flex items-center gap-1 text-xs sm:ml-2 ${
        isPerfect ? 'text-gold' : 'text-gray-500 dark:text-gray-400'
      }`}
    >
      <Star size={12} />
      {completedAchievements.length} / {data.length}
    </span>
  );
};

const Game = ({ game, achievements }: ProjectsProps['games'][number]) => {
  const { name, playtime_forever } = game;
  const hours = Math.floor(playtime_forever / 60);

  return (
    <div className="flex flex-col gap-2 py-2 sm:flex-row sm:gap-8">
      <p className="flex flex-1 flex-col gap-2 text-md text-gray-900 dark:text-white sm:flex-row sm:items-center">
        {name}
        {Boolean(achievements.length) && <Achievements data={achievements} />}
      </p>
      <p className="flex-0 flex w-24 text-sm text-gray-500 dark:text-gray-400 sm:justify-end">
        {playtime_forever > 60
          ? `${hours} ${hours === 1 ? 'hour' : 'hours'}`
          : `${playtime_forever} ${
              playtime_forever === 1 ? 'minute' : 'minutes'
            }`}
      </p>
    </div>
  );
};

const sortByPlaytime = (
  gameA: ProjectsProps['games'][number],
  gameB: ProjectsProps['games'][number]
) => (gameB.game.playtime_forever > gameA.game.playtime_forever ? 1 : -1);

const Games: FC<ProjectsProps> = ({ data, games }) => {
  const totalPlaytime = games.reduce(
    (acc, { game }) => acc + game.playtime_forever,
    0
  );
  const totalHours = Math.floor(totalPlaytime / 60);
  const totalAchievements = games.reduce(
    (acc, { achievements }) =>
      acc + achievements.filter(({ achieved }) => achieved).length,
    0
  );

  return (
    <Layout title={data.title} description={data.description}>
      <div className="flex flex-col gap-4">
        <p className="animate-enter text-sm text-gray-500 opacity-0 animation-delay-100 dark:text-gray-400">
          {data.description}
        </p>
        <p className="animate-enter text-xs text-gray-500 opacity-0 animation-delay-200 dark:text-gray-400">
          {totalHours} hours of tracked playtime and {totalAchievements}{' '}
          achievements across {games.length} games.
        </p>
        <div className="mt-4">
          <List
            data={[
              { title: 'All Games', items: games.sort(sortByPlaytime) },
              {
                title: 'Perfect Games',
                items: games.sort(sortByPlaytime).filter(isPerfectGame),
              },
            ]}
            renderItem={Game}
            indexKey="id"
            searchKeys={['game.name']}
          />
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const { data } = (await getPage(
    { previewData },
    'games'
  )) as PrismicDocumentWithUID;
  const games = await getGames();

  return {
    props: {
      data,
      games,
    },
  };
};

export default Games;
