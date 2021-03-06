import { npmAddScript } from './npm-add-script';

export function addScripts({ force }: Record<string, unknown>) {
  if (force) {
    console.warn(
      "Have you used the force option so we can overwrite all your existing package scripts? Heh, champs, I hope you know what you're doing",
    );
  }
  const scripts = {
    prepare: 'npm run build',
    clear: 'npm run clear:build && npm run clear:modules',
    'clear:build': 'del-cli ./dist',
    'clear:modules': 'del-cli ./node_modules',
    prebuild: 'npm run clear:build && del-cli tsconfig.tsbuildinfo',
    build: 'tsc',
    test: 'mocha',
    'test:coverage': 'nyc npm test',
    'preaction:verify:update-modules':
      'npm run action:verify:update-modules:check',
    'action:verify:update-modules':
      'npm run action:verify:update-modules:reinstall && npm run action:verify:update-modules:clean',
    'action:verify:update-modules:clean': 'del-cli .check',
    lint: 'npm run lint:format && npm run lint:style',
    'lint:fix': 'npm run lint:format:fix && npm run lint:style:fix',
    'lint:format': "prettier --check '{src,test}/**/*.ts'",
    'lint:format:fix': "prettier --write '{src,test}/**/*.ts'",
    'lint:style': "eslint '**/*.ts'",
    'lint:style:fix': "eslint '**/*.ts' --fix",
    'release:update-changelog': 'codibre-confs update-changelog',
    postversion: 'npm run release:update-changelog',
  };
  for (const entry of Object.entries(scripts)) {
    try {
      npmAddScript({ key: entry[0], value: entry[1], force });
    } catch (err) {
      console.error(
        `${err.message} (tip: you can run the command with force and try again!)`,
      );
    }
  }
}
