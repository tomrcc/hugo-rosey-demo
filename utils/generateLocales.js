const fs = require('file-system');

let inputFile = './rosey/base.json';
let localesDirPath = './rosey/locales';
let locale = 'fr-fr.json';
let localePath = localesDirPath + '/' + locale;
let outputFileData = {};

async function main() {
  if (fs.existsSync(inputFile)) {
    inputFile = JSON.parse(fs.readFileSync(inputFile)).keys;
  } else {
    console.log('rosey/base.json does not exist');
  }
  if (fs.existsSync(localePath)) {
    outputFileData = JSON.parse(fs.readFileSync(localePath));
  } else {
    console.log('rosey/locales/fr-fr.json does not exist, creating one now');
    fs.writeFileSync(localePath, JSON.stringify({}));
  }

  // TODO: 
  // Refactor to take multiple languages
  // Set up env variables so we can use those to set langs, rather than hardcoding

  // Look into rosey check
  for (const inputKey in inputFile) {
    const inputTranslationObj = inputFile[inputKey];
    // If key doesn't exist in our output file, add it
    if (outputFileData[inputKey] === undefined) {
      outputFileData[inputKey] = {
        original: inputTranslationObj['original'],
        value: inputTranslationObj.value,
      };
    }
    for (const outputKey in outputFileData) {
      const outputTranslationObj = outputFileData[outputKey];
      // If key exists in both files, and doesn't already have a translation value update the value.
      // If key exists in both files, and already has a translation value, do nothing.
      if (outputKey === inputKey && outputTranslationObj.value === null) {
        outputFileData[inputKey] = {
          original: inputTranslationObj['original'],
          value: inputTranslationObj.value,
        };
      }
      // If key no longer exists in our base.json, delete it from our locale
      if (inputFile[outputKey] === undefined) {
        console.log(`Deleting key: ${outputKey} from translations, as it is no longer found on the site.`)
        delete outputFileData[outputKey];
      }
    }
  }

  fs.writeFile(localePath, JSON.stringify(outputFileData), (err) => {
    if (err) throw err;
    console.log(localePath + ' updated succesfully');
  });
}

main().catch((err) => {
  console.error('The sample encountered an error:', err);
});

module.exports = { main };
