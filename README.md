# Ongaku Ryoho

Music therapy.


###### Hold on a sec, what is this?

A music player which connects to your cloud storage.


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

So, in short, to get a production build running, you follow these steps:

1. Setup a Firebase app
2. Make a `.env` file with `FIREBASE_URL`
3. `npm run build`
4. `surge ./build something-something.surge.sh`
