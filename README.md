# Mira Pro - React Admin & Dashboard Template

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites

For the required Node.js version, please check the `.nvmrc` file. You can download NodeJS at [https://nodejs.org/](https://nodejs.org/). You can also use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects.

## Quick Start

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


## sabaiydev fix warning 
1 failed to parse source map 
how to fix:
 1 copy this code to .env file: "GENERATE_SOURCEMAP=false".
2 warning eslint
 how to fix: copy code below to path ".eslintrc file" and put code to 
 rules:
 "semi": ["error", "always"],
 "quotes": ["error", "double"]