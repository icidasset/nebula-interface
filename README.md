# Ongaku Ryoho

Music therapy.

###### Hold on a sec, what is this?

A music player which connects to your cloud storage.



## How to use

```bash
# install dependencies
npm install

# setup necessary env variables (dotenv)
# default firebase url (used if FIREBASE_URL env variable not provided)
echo "DEFAULT_FIREBASE_URL=ADD_FIREBASE_URL_HERE" > .env

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
2. Setup Firebase rules (security): https://raw.githubusercontent.com/icidasset/ongaku-ryoho/master/config/firebase_security.json5
3. Enable Email & Password Authentication on Firebase
4. `FIREBASE_URL=https://something-something.firebaseio.com npm run build`
5. `surge ./build something-something.surge.sh`

__You can also set a custom Firebase URL in the app itself!__
