import type { DribbbleSliderProps } from '../slices/DribbbleSlider';
import { createBrowser } from './browser';

type DribbbleShotData = {
  title: string;
  commentsCount: number;
  likesCount: number;
  viewsCount: number;
  shotMediaPreview: {
    mediaType: string | null;
    shotGifUrl: string;
    shotImageUrl: string;
    shotVideoUrl: string | null;
  };
};

const parseDribbbleShot = async ({
  shot,
}: DribbbleSliderProps['items'][number]): Promise<
  DribbbleSliderProps['items'][number]
> => {
  const browser = await createBrowser();
  const page = await browser.newPage();
  await page.goto(`https://dribbble.com/shots/${shot}`);

  const config = (await page.evaluate('Dribbble.JsConfig')) as {
    shotData: Record<string, unknown>;
  };

  await browser.close();

  const { title, shotMediaPreview, commentsCount, likesCount, viewsCount } =
    config.shotData as DribbbleShotData;

  return {
    shot,
    title,
    image: shotMediaPreview.shotVideoUrl ?? shotMediaPreview.shotGifUrl,
    comments: commentsCount,
    likes: likesCount,
    views: viewsCount,
  };
};

const parseDribbbleShots = async (
  items: DribbbleSliderProps['items']
): Promise<DribbbleSliderProps['items']> =>
  Promise.all(items.map(parseDribbbleShot));

export default parseDribbbleShots;
