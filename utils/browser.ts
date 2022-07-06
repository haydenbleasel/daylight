import type { Browser } from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

export const createBrowser = async (): Promise<Browser> => {
  const browser = await chromium.puppeteer.launch(
    process.env.AWS_EXECUTION_ENV
      ? {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath,
          headless: chromium.headless,
          ignoreHTTPSErrors: true,
        }
      : {
          args: [],
          executablePath:
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        }
  );

  return browser;
};
