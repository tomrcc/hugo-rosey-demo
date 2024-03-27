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
  // Look into rosey check
  // Need to check behaviour if the key has changed, or if it is no longer in the base.json file
  // Set up env variables so we can use those to set which languages locale files are created
  for (const inputKey in inputFile) {
    const translationEntry = inputFile[inputKey];
    console.log('inputFile', translationEntry);
    if (outputFileData[inputKey] === undefined) {
      outputFileData[inputKey] = {
        original: translationEntry['original'],
        value: translationEntry.value,
      };
    }
    for (const outputKey in outputFileData) {
      console.log('outputFileData', outputFileData[outputKey]);
      if (outputKey === inputKey && outputFileData[outputKey].value === null) {
        outputFileData[inputKey] = {
          original: translationEntry['original'],
          value: translationEntry.value,
        };
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
