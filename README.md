# Micro Fleet - Backend Common library for Frontend on Browser

Belongs to Micro Fleet framework, contains helpers, models and constants for Frontend.

## INSTALLATION

- Stable version: `npm i @micro-fleet/common-browser`
- Edge (development) version: `npm i git@github.com:gennovative/micro-fleet-common-browser.git`

## DEVELOPMENT

- Install packages in `peerDependencies` section with command `npm i --no-save {package name}@{version}`. Or if you want to use directly neighbor packages, excute `npm run linkPackages`.
- `npm run build` to transpile TypeScript then run unit tests (if any) (equiv. `npm run compile` + `npm run test` (if any)).
- `npm run compile`: To transpile TypeScript into JavaScript.
- `npm run watch`: To transpile without running unit tests, then watch for changes in *.ts files and re-transpile on save.
- `npm run test`: To run unit tests.
  * After tests finish, open file `/coverage/index.html` with a web browser to see the code coverage report which is mapped to TypeScript code.

## RELEASE

- `npm run release`: To transpile and create `app.d.ts` definition file.
- **Note:** Please commit transpiled code in folder `dist` and definition file `app.d.ts` relevant to the TypeScript version.