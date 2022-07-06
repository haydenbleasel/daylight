import type { Browser } from 'puppeteer-core';
import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';

export const createBrowser = async (): Promise<Browser> => {
  const browser = await puppeteer.launch(
    process.env.AWS_EXECUTION_ENV
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        }
      : {
          args: [],
          executablePath:
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        }
  );

  return browser;
};
