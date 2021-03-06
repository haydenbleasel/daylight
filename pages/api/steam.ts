import res from '../../utils/response';

type SteamResponse = {
  response: {
    players: {
      personastate: number;
      gameextrainfo?: string;
    }[];
  };
};

export const config = {
  runtime: 'experimental-edge',
};

const handler = async (): Promise<Response> => {
  try {
    const response = await fetch(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${
        process.env.STEAM_API_KEY ?? ''
      }&steamids=${process.env.STEAM_ID ?? ''}`
    );

    const data = (await response.json()) as SteamResponse;
    const { personastate, gameextrainfo } = data.response.players[0];

    // 0 means offline, everything else is a variation of online.
    if (personastate && gameextrainfo) {
      return res(200, {
        status: 'online',
        game: gameextrainfo,
      });
    }

    return res(200, { status: 'offline', game: undefined });
  } catch (error) {
    const message = error instanceof Error ? error.message : (error as string);

    return res(500, { error: message });
  }
};

export default handler;
