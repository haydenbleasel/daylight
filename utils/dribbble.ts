import type { DribbbleSliderProps } from '../slices/DribbbleSlider';

const parseDribbbleShot = async ({
  shot,
}: DribbbleSliderProps['items'][number]): Promise<
  DribbbleSliderProps['items'][number]
> => {
  const response = await fetch(
    `https://slam-dunk.haydenbleasel.com/api/${shot}`
  );
  const data = (await response.json()) as Omit<
    DribbbleSliderProps['items'][number]['shot'],
    'shot'
  >;

  return {
    shot,
    ...data,
  };
};

const parseDribbbleShots = async (
  items: DribbbleSliderProps['items']
): Promise<DribbbleSliderProps['items']> =>
  Promise.all(items.map(parseDribbbleShot));

export default parseDribbbleShots;
