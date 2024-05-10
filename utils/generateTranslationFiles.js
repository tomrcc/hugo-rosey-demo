const fs = require('file-system');
const YAML = require('yaml');
const slugify = require('slugify');

const inputFilePath = './rosey/base.json';
const translationFilesDirPath = './rosey/translations';
const locales = ['es-es'];
let outputFileData = {};
let inputFileData = {};

async function main(locale) {
  // Find the translation file path
  const translationFilePath = translationFilesDirPath + '/' + locale + '.yaml';

  if (fs.existsSync(inputFilePath)) {
    inputFileData = JSON.parse(fs.readFileSync(inputFilePath)).keys;
  } else {
    console.log('rosey/base.json does not exist');
  }

  if (fs.existsSync(translationFilePath)) {
    outputFileData = YAML.parse(fs.readFileSync(translationFilePath, 'utf8'));
  } else {
    console.log(`${translationFilePath} does not exist, creating one now`);
    fs.writeFileSync(translationFilePath, '_inputs: {}');
  }

  for (const inputKey in inputFileData) {
    const inputTranslationObj = inputFileData[inputKey];

    const slugifiedInputKey = slugify(inputTranslationObj.original, {
      remove: '.',
    }).toLowerCase();

    const translationPages = Object.keys(inputTranslationObj.pages);
    console.log(translationPages);

    const translationLocations = translationPages.map(
      (page) =>
        `[${page}](https://app.cloudcannon.com/41142/editor#sites/125080/collections/pages/:/edit?editor=visual&url=%2F&path=%2Fcontent%2F_index.md&collection=pages) |`
    );

    console.log(translationLocations);
    // const translationLocationComment = 'Locations: ' + translationLocations;
    // console.log(translationLocationComment);

    // If no inputs obj exists, create one
    if (!outputFileData['_inputs']) {
      outputFileData['_inputs'] = {};
    }

    // Add each entry to our _inputs obj
    if (!outputFileData['_inputs'][slugifiedInputKey]) {
      outputFileData['_inputs'][slugifiedInputKey] = {
        label: inputTranslationObj.original,
        type: 'textarea',
        comment: translationLocations,
      };
    }

    // If entry doesn't exist in our output file, add it
    if (outputFileData[slugifiedInputKey] === undefined) {
      outputFileData[slugifiedInputKey] = inputTranslationObj['original'];
    }
  }

  fs.writeFile(translationFilePath, YAML.stringify(outputFileData), (err) => {
    if (err) throw err;
    console.log(translationFilePath + ' updated succesfully');
  });
}

// Loop through locales
for (let i = 0; i < locales.length; i++) {
  const locale = locales[i];

  main(locale).catch((err) => {
    console.error(`Encountered an error translating ${locale}:`, err);
  });
}

module.exports = { main };
