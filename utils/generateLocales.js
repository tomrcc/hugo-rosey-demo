const fs = require('file-system');

let inputFile = './rosey/base.json';
let outputFile = './rosey/locales/fr-fr.json';
let outputFileData = {};

async function main() {
  if (fs.existsSync(inputFile)) {
    inputFile = JSON.parse(fs.readFileSync(inputFile)).keys;
  } else {
    console.log('rosey/base.json does not exist');
  }
  if (fs.existsSync(outputFile)) {
    outputFileData = JSON.parse(fs.readFileSync(outputFile));
  } else {
    console.log('rosey/locales/fr-fr.json does not exist, creating one now');
    fs.writeFileSync(outputFile, JSON.stringify({}));
  }

  // TODO: 
  // Delete keys in our locale that are no longer in our base.json

  // Refactor to take multiple languages
  // Set up env variables so we can use those to set langs, rather than hardcoding

  // Look into rosey check
  for (const inputKey in inputFile) {
    const inputTranslationObj = inputFile[inputKey];
    // console.log('inputFile', inputTranslationObj);
    if (outputFileData[inputKey] === undefined) {
      outputFileData[inputKey] = {
        original: inputTranslationObj['original'],
        value: inputTranslationObj.value,
      };
    }
    for (const outputKey in outputFileData) {
      const outputTranslationObj = outputFileData[outputKey];
      // console.log('outputFileData', outputTranslationObj);
      if (outputKey === inputKey && outputTranslationObj.value === null) {
        outputFileData[inputKey] = {
          original: translationEntry['original'],
          value: translationEntry.value,
        };
      }
      if (inputFile[outputKey] === undefined) {
        delete outputFileData[outputKey];
      }
    }
  }

  fs.writeFile(outputFile, JSON.stringify(outputFileData), (err) => {
    if (err) throw err;
    console.log(outputFile + ' updated succesfully');
  });
}

main().catch((err) => {
  console.error('The sample encountered an error:', err);
});

module.exports = { main };
