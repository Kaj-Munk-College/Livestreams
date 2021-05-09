# Livestreams platform

© Kaj Munk College 2021
Original Author: [Bram Koene](https://github.com/minestarnl)

## Project summary

This project is a platform to host livestreams at Kaj Munk College.

There are 3 different Builds:
[Web (VUE)](#web)
[Destkop (ELECTRON)](#desktop)
[Mobile (CAPACITOR)](#mobile)

---

## web

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Uploading a new version

As soon as a push is made towards the main branch the CI will compile and generate the needed code in the [gh-pages](tree/gh-pages) branch

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Desktop

Fistly install the dependencies

```
npm install
```

### Serve the application for development

```
npm run electron:serve
```

### Build the application

```
npm run electron:build
```

### More information

[Electron Build](https://www.electron.build)

## Mobile

```
npm install
```

### iOS

:warning: This can only be done on MacOS

```
# Build the web version
npm run build

# Copy changes to Capacitor
npx cap copy ios

# If any plugins were added run
npx cap sync ios

# Open the project in XCode
npx cap open ios
```

### Android

```
# Build the web version
npm run build

# Copy changes to Capacitor
npx cap copy android

# If any plugins were added run
npx cap sync android

# Open the project in android studio
npx cap open android
```
