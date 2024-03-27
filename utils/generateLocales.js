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

  // TODO: Check if the original already has a translation, as we don't want to overwrite everytime.
  // Only write it to the object if it doesn't exist with a translation already.
  // Look into rosey check
  // Set up CloudCannon so that we have a UI to enter translations manually
  // Check Rosey uses the locale file to generate the translated version properly, with values we have set in the data editor
  // Set up env variables so we can use those to set which languages locale files are created
  for (const inputKey in inputFile) {
    const translationEntry = inputFile[inputKey];
    console.log('inputFile', translationEntry);
    outputFileData[inputKey] = {
      original: translationEntry['original'],
      translation: translationEntry.value,
    };
    // for (const outputKey in outputFileData) {
    //   console.log('outputFileData', outputFileData[outputKey]);
    // }
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
