// adapted from https://github.com/FabricMC/fabricmc.net/blob/main/scripts/src/lib/Api.ts
// MIT license

import { DOMParser } from 'jsr:@b-fuze/deno-dom@0.1.47';

export interface GameVersion {
  version: string;
  stable: boolean;
}

export interface InstallerVersion {
  stable: boolean;
  url: string;
  version: string;
  maven: string;
}

export interface LoaderVersion {
  separator: string;
  build: number;
  maven: string;
  version: string;
  stable: boolean;
}

export interface YarnVersion {
  gameVersion: string;
  separator: string;
  build: number;
  maven: string;
  version: string;
  stable: boolean;
}

// Do not use these fallback servers to interact with our web services. They can and will be unavailable at times and only support limited throughput.
const META = ['https://meta.fabricmc.net', 'https://meta2.fabricmc.net'];
const MAVEN = ['https://maven.fabricmc.net', 'https://maven2.fabricmc.net'];

export const getGameVersions = () =>
  getJson<GameVersion[]>(META, '/v2/versions/game');

export const getLoaderVersions = () =>
  getJson<LoaderVersion[]>(META, '/v2/versions/loader');

export const getYarnVersions = () =>
  getJson<YarnVersion[]>(META, '/v2/versions/yarn');

export const getApiVersions = (): Promise<string[]> =>
  getMavenVersions('/net/fabricmc/fabric-api/fabric-api/maven-metadata.xml');

export const getApiVersionForMinecraft = async (
  minecraftVersion: string,
): Promise<string> =>
  (await getApiVersions())
    .filter((v) => isApiVersionvalidForMcVersion(v, minecraftVersion))
    .pop()!;

export const isApiVersionvalidForMcVersion = (
  apiVersion: string,
  mcVersion: string | undefined,
): boolean => {
  if (!mcVersion) {
    return false;
  }

  if (mcVersion == '1.18') {
    return apiVersion == '0.44.0+1.18';
  }

  let branch = mcVersion;

  const versionBranches = [
    '1.14',
    '1.15',
    '1.16',
    '1.17',
    '1.18',
    '1.19',
    '1.20',
    '20w14infinite',
    '1.18_experimental',
  ];

  versionBranches.forEach((v) => {
    if (mcVersion.startsWith(v)) {
      branch = v;
    }
  });

  // Very dumb but idk of a better (easy) way.
  if (mcVersion.startsWith('22w13oneblockatatime')) {
    branch = '22w13oneblockatatime';
  } else if (mcVersion.startsWith('24w')) {
    branch = '1.21.2';
  } else if (mcVersion.startsWith('23w')) {
    branch = '1.20.5';
  } else if (mcVersion.startsWith('22w')) {
    branch = '1.19.3';
  } else if (mcVersion.startsWith('1.18.2')) {
    branch = '1.18.2';
  } else if (mcVersion.startsWith('1.19.1')) {
    branch = '1.19.1';
  } else if (mcVersion.startsWith('1.19.2')) {
    branch = '1.19.2';
  } else if (mcVersion.startsWith('1.19.3')) {
    branch = '1.19.3';
  } else if (mcVersion.startsWith('1.19.4')) {
    branch = '1.19.4';
  } else if (mcVersion.startsWith('1.20.1')) {
    branch = '1.20.1';
  } else if (mcVersion.startsWith('1.20.2')) {
    branch = '1.20.2';
  } else if (mcVersion.startsWith('1.20.3')) {
    branch = '1.20.3';
  } else if (mcVersion.startsWith('1.20.4')) {
    branch = '1.20.4';
  } else if (mcVersion.startsWith('1.20.5')) {
    branch = '1.20.5';
  } else if (mcVersion.startsWith('1.20.6')) {
    branch = '1.20.6';
  } else if (mcVersion.startsWith('1.21.3')) {
    branch = '1.21.3';
  } else if (mcVersion.startsWith('1.21.2')) {
    branch = '1.21.2';
  } else if (mcVersion.startsWith('1.21.1')) {
    branch = '1.21.1';
  } else if (mcVersion.startsWith('1.21')) {
    branch = '1.21';
  } else if (mcVersion.startsWith('21w')) {
    branch = '1.18';
  } else if (mcVersion.startsWith('20w')) {
    branch = '1.17';
  } else if (mcVersion.startsWith('19w') || mcVersion.startsWith('18w')) {
    branch = '1.14';
  }

  return apiVersion.endsWith('-' + branch) || apiVersion.endsWith('+' + branch);
};

let xmlVersionParser = (xml: string): string[] =>
  Array.from(
    new DOMParser()
      .parseFromString(xml, 'text/html')
      .getElementsByTagName('version'),
  ).map((v) => v.childNodes[0].nodeValue as string);

export const setXmlVersionParser = (parser: (xml: string) => string[]) =>
  (xmlVersionParser = parser);

export const getMavenVersions = async (path: string): Promise<string[]> =>
  xmlVersionParser(await getText(MAVEN, path));

const getJson = async <T>(hostnames: string[], path: string) =>
  (await (await fetchFallback(hostnames, path)).json()) as T;

const getText = async (hostnames: string[], path: string): Promise<string> =>
  await (await fetchFallback(hostnames, path)).text();

const fetchFallback = async (
  hostnames: string[],
  path: string,
): Promise<Response> => {
  for (const hostname of hostnames) {
    try {
      const response = await fetch(hostname + path);

      if (response.ok) {
        return response;
      }

      console.error(await response.text());
    } catch (e) {
      console.error(e);
    }
  }

  throw new Error(`Failed to fetch: ${hostnames[0] + path}`);
};
