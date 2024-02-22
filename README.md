# Zut Event App

## How to start the app:

First, create .env file with 3 variables:

-   `DATABASE_URL` – this is the url for remote connection to the database
-   `SESSION_SECRET` – the secret used for authentication thanks to cookie sessions, can be generated using openssl rand -hex 32 or thanks to https://1password.com/password-generator/
-   `TINY_API_KEY` – key needed for the text editor to work https://www.tiny.cloud/get-tiny/

Then, from your terminal:

```sh
npm install
npm run build
npm run setup
npm run dev

```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

-   `build/`
-   `public/build/`
