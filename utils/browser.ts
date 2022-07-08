import type { Browser } from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';

export const createBrowser = async (): Promise<Browser> => {
  const browser = chrome.puppeteer.launch();

  return browser;
};
