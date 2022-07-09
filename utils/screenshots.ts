/* eslint-disable import/no-nodejs-modules */
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import type { RichTextField } from '@prismicio/types';

const root = path.resolve(process.cwd());
const screenshotsDirectory = path.join(root, '/public/screenshots');

mkdirp.sync(screenshotsDirectory);

type GlimpseResponse = {
  error?: string;
  image?: string;
};

const screenshot = async (url: string): Promise<void> => {
  const { host } = new URL(url);
  const filename = path.join(screenshotsDirectory, `/${host}.png`);

  // eslint-disable-next-line no-console
  console.log(`Screenshotting ${url}...`);

  if (fs.existsSync(filename)) {
    return;
  }

  const response = await fetch(
    'https://glimpse.haydenbleasel.com/api/screenshot',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    }
  );

  const { image, error } = (await response.json()) as GlimpseResponse;

  if (error) {
    throw new Error(error);
  }

  if (!image) {
    throw new Error('No image found');
  }

  fs.writeFileSync(filename, image, 'base64');
};

const screenshots = async (data: RichTextField): Promise<void> => {
  const hyperlinks: string[] = [];
  const excludedLinks = ['twitter.com', 'linkedin.com', 'haydenbleasel.com'];

  data.forEach((content) => {
    if (
      content.type !== 'heading1' &&
      content.type !== 'heading2' &&
      content.type !== 'heading3' &&
      content.type !== 'heading4' &&
      content.type !== 'heading5' &&
      content.type !== 'heading6' &&
      content.type !== 'paragraph'
    ) {
      return;
    }

    content.spans.forEach((span) => {
      if (
        span.type === 'hyperlink' &&
        span.data.link_type === 'Web' &&
        !excludedLinks.some((excluded) => span.data.url?.includes(excluded))
      ) {
        hyperlinks.push(span.data.url);
      }
    });
  });

  const hyperlinkPromises = hyperlinks.map(screenshot);

  await Promise.all(hyperlinkPromises);
};

export default screenshots;
