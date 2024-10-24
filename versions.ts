import {
  getGameVersions,
  getLoaderVersions,
  getYarnVersions,
  getApiVersions,
  isApiVersionvalidForMcVersion,
} from './api.ts';

const gameVersions = (await getGameVersions()).filter(
  (version) => version.stable,
);
const yarnVersions = await getYarnVersions();
const loaderVersion = (await getLoaderVersions())[0].version;
const apiVersions = await getApiVersions();

console.log(
  gameVersions.map((gameVersion) => `- "${gameVersion.version}"`).join('\n'),
);

const versions = gameVersions.map(({ version }) => [
  version,
  yarnVersions.filter((yarnVersion) => yarnVersion.gameVersion === version)[0]
    .version,
  loaderVersion,
  apiVersions.filter((apiVersion) =>
    isApiVersionvalidForMcVersion(apiVersion, version),
  )[0],
]);

console.log(
  `{{ get .Scaffold.version (dict ${versions
    .map(([game, yarn, _loader, _api]) => `"${game}" "${yarn}"`)
    .join(' ')}) }}`,
);

console.log(
  `{{ get .Scaffold.version (dict ${versions
    .map(([game, _yarn, loader, _api]) => `"${game}" "${loader}"`)
    .join(' ')}) }}`,
);

console.log(
  `{{ get .Scaffold.version (dict ${versions
    .map(([game, _yarn, _loader, api]) => `"${game}" "${api}"`)
    .join(' ')}) }}`,
);
