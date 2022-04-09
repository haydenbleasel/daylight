import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import type {
  GroupField,
  KeyTextField,
  PrismicDocumentWithUID,
} from '@prismicio/types';
import { createClient } from '@prismicio/client';
import Layout from '../components/layout';
import { getPage } from '../utils/prismic';

type ClientsData = {
  data: {
    rga: GroupField<{
      client: KeyTextField;
    }>;
    freelance: GroupField<{
      client: KeyTextField;
    }>;
  };
  jellypepper: GroupField<{
    client: KeyTextField;
  }>;
};

type ClientListData = {
  name: string;
  data: GroupField<{
    client: KeyTextField;
  }>;
};

const ClientList: FC<ClientListData> = ({ name, data }) => (
  <div className="mt-4 flex gap-8">
    <p className="flex-0 w-24 text-sm text-gray-500 dark:text-gray-400">
      {name}
    </p>
    <div className="flex flex-1 flex-col gap-1">
      {data
        .sort((clientA, clientB) => {
          if (!clientA.client || !clientB.client) {
            return 0;
          }

          return clientB.client < clientA.client ? 1 : -1;
        })
        .map(({ client }, index) => (
          <p className="text-md text-gray-900 dark:text-white" key={index}>
            {client}
          </p>
        ))}
    </div>
  </div>
);

const Clients: FC<ClientsData> = ({ data, jellypepper }) => (
  <Layout
    title="Clients"
    description="A list of clients I've worked with over the years."
  >
    <div className="flex flex-col gap-8">
      <ClientList name="R/GA" data={data.rga} />
      <ClientList name="Jellypepper" data={jellypepper} />
      <ClientList name="Freelance" data={data.freelance} />
    </div>
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const { data } = (await getPage(
    'clients',
    previewData
  )) as PrismicDocumentWithUID;
  const jellypepperPrismicClient = createClient(
    process.env.JELLYPEPPER_PRISMIC_ENDPOINT ?? 'loading',
    {
      fetch,
      accessToken: process.env.JELLYPEPPER_PRISMIC_ACCESS_TOKEN ?? '',
    }
  );
  const clients = (await jellypepperPrismicClient.getAllByType(
    'client'
  )) as unknown as PrismicDocumentWithUID<{
    client_name: KeyTextField;
  }>[];
  const jellypepper = clients.map((client) => ({
    client: client.data.client_name,
  }));

  return {
    props: {
      data,
      jellypepper,
    },
  };
};

export default Clients;
