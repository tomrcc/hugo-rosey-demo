# Hugo Rosey Bookshop Starter

A starter template for a new Hugo site built with [Bookshop](https://github.com/CloudCannon/bookshop) components.
This template uses [Rosey](https://rosey.app/) to generate a multilingual site from one language.
We run Rosey on your built site in the CloudCannon postbuild.
Rosey generates a base.json file wherever it detects a ```data-rosey=""``` tag in your built site.
From this base.json file we run a script that creates a locales file for each locale listed in your LOCALES environment variable.
Editors can see these locales files in the CloudCannon UI, and enter translations for each phrase.
Rosey then uses the locales files, to generate a multilingual site.

## Local Development

To run site locally:
```bash
npm i
npm start
```

To run Rosey locally:
```bash
npm i
hugo
npx rosey generate --source public
node utils/generateLocales.js
```
Enter a translated value in one of the locale files.
To generate a multilingual site locally:
```bash
npx rosey build --source public --dest public_translated
```

## Environment Variables
The ```SYNC_PATHS=/rosey/``` environment variable tells CloudCannon to sync the generated data in the ```/rosey/``` directory from our postbuild back to the source repository.

The ```TRANSLATE=true``` environment variable tells CloudCannon to generate a site from the locales folder. Only set this to ```true``` on the production site. Setting this to ```true``` on our staging sites can interfere with CloudCannon's UI.

The ```LOCALES=fr-fr,de-de,es-es``` tells CloudCannon to generate locale files for language codes 'fr-fr', 'de-de', and 'es-es'. Set this value to whichever languages you would like to generate with Rosey. Language codes should follow the placeholder format provided, and are separated by a comma.

