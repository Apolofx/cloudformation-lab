## Custom Layers

Folder structure:

📁 `layers/<Layer Name>`

- 📄 `tsconfig.json` (see tsconfig in _layers/commons/tsconfig.json_)
- 📄 `package.json` (this includes both the libraries [*dependencies*] that the layer will use and the necessary scripts to build)
- 📄 `index.ts` (from here we export all the clients/helpers we want to expose with the layer)
- Custom layers ContentUri attribute in `template.yaml` should now be referencing to `dist` folder, like this -> `- ContentUri: layers/<layer-folder-name>/dist`

## Third Party Layer

Folder structure:

📁 `layers/<Layer Name>`

- 📄 `package.json` with the dependency that is going to be built, declared in **dependencies**
