# Web UI for Westpac 'Satellite'

## Requirements

- Token issuing server
- Webpack
- NPM

## Development setup

A `.npmrc` file with a valid auth token is required to install the private npm
modules. This can be obtained from Soul Machines.

Install the dependencies and start the dev server

```bash
npm install
npm run dev
```

## Environment variables

Webpack builds require environment variables to be passed in;

- `TOKEN_ISSUER`: The token server endpoint

These can be passed in manually or defined in a `.env` file, e.g;

```bash
webpack --mode production \
    --env.TOKEN_ISSUER=https://your-token-server/auth/authorize
```

## Running tests

```bash
npm test
```
