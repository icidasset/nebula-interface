# Ongaku Ryoho

Music therapy.


## How to use

```bash
# install dependencies
npm install

# setup necessary env variables (dotenv)
echo "FIREBASE_URL=ADD_FIREBASE_URL_HERE" > .env

# make a build, watch and start a server
npm run dev

# make a minified (production) build
npm run build
```

Example of how to deploy, using surge (not included in dependencies).

```bash
surge ./build ongaku-ryoho-301253298.surge.sh
```

So, in short, to get a production build running, you do two things:

1. `npm run build`
2. `surge ./build something-something.surge.sh`
