import type { FC } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { PrismicProvider } from '@prismicio/react';
import { SocialProfileJsonLd } from 'next-seo';
import { PrismicPreview } from '@prismicio/next';
import { getClient, linkResolver } from '../utils/prismic';
import '../styles/globals.css';
import '../styles/dev.css';
import CommandBar from '../components/commandbar';
import Menu from '../components/menu';
import ExternalLinkComponent from '../components/externalLink';
import InternalLinkComponent from '../components/internalLink';
import useAnalytics from '../hooks/useAnalytics';
import richTextComponents from '../components/richTextComponents';

type SocialPlatform = {
  id: string;
  name: string;
  url: string;
};

export const social: SocialPlatform[] = [
  {
    id: 'twitter',
    name: 'Twitter',
    url: 'https://twitter.com/haydenbleasel',
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    url: 'https://dribbble.com/haydenbleasel',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/hayden.bleasel/',
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/haydenbleasel/',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/haydenbleasel',
  },
  {
    id: 'producthunt',
    name: 'ProductHunt',
    url: 'https://www.producthunt.com/@haydenbleasel',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    url: 'https://open.spotify.com/user/haydenbleasel',
  },
  {
    id: 'devto',
    name: 'Dev.to',
    url: 'https://dev.to/haydenbleasel',
  },
  {
    id: 'figma',
    name: 'Figma',
    url: 'https://www.figma.com/@haydenbleasel',
  },
  {
    id: 'medium',
    name: 'Medium',
    url: 'https://haydenbleasel.medium.com/',
  },
];

const App: FC<AppProps> = ({ Component, pageProps }) => {
  useAnalytics();

  return (
    <CommandBar>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <meta name="application-name" content="Hayden Bleasel" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hayden Bleasel" />

        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#F5F5F9" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#F5F5F9" />
        <link rel="manifest" href="/manifest.json" />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#F5F5F9" />
      </Head>
      <SocialProfileJsonLd
        type="Person"
        name="Hayden Bleasel"
        url={process.env.NEXT_PUBLIC_SITE_URL ?? ''}
        sameAs={Object.values(social).map(({ url }) => url)}
      />
      <PrismicProvider
        linkResolver={linkResolver}
        internalLinkComponent={InternalLinkComponent}
        externalLinkComponent={ExternalLinkComponent}
        client={getClient()}
        richTextComponents={richTextComponents}
      >
        <PrismicPreview
          repositoryName={process.env.NEXT_PUBLIC_PRISMIC_ENDPOINT ?? 'loading'}
        >
          <Component {...pageProps} />
        </PrismicPreview>
      </PrismicProvider>
      <Menu />
      <Toaster
        containerClassName="print:hidden"
        toastOptions={{
          duration: 5000,
          position: 'bottom-right',
        }}
      />
    </CommandBar>
  );
};

export default App;
