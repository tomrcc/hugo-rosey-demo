const fs = require('file-system');
const YAML = require('yaml');
const slugify = require('slugify');

const inputFilePath = './rosey/base.json';
const translationFilesDirPath = './rosey/translations';
const locales = ['es-es'];
let outputFileData = {};
let inputFileData = {};
let cleanedOutputFileData = {};

async function main(locale) {
  // Find the translation file path
  const translationFilePath = translationFilesDirPath + '/' + locale + '.yaml';

  // Get the Rosey generated data
  if (fs.existsSync(inputFilePath)) {
    inputFileData = JSON.parse(fs.readFileSync(inputFilePath)).keys;
  } else {
    console.log('rosey/base.json does not exist');
  }

  // Get our old translations file
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

    // Add a link for each page the translation appears on, but not tags and categories pages
    const translationPages = Object.keys(inputTranslationObj.pages).filter(
      (page) => {
        return page !== 'tags/index.html' && page !== 'categories/index.html';
      }
    );

    const translationLocations = translationPages.map((page) => {
      // TODO: Add dynamic collection to editor link
      // TODO: Maybe add config file that you can set content/visual editor or live site preview for translation link
      return `[${page}](https://app.cloudcannon.com/41142/editor#sites/125080/collections/pages/:/edit?editor=visual&url=%2F&path=%2Fcontent%2F${page
        .replace('index', '_index')
        .replace('/', '%2F')
        .replace('.html', '.md')}&collection=pages)`;
    });

    // If no inputs obj exists, create one
    if (!cleanedOutputFileData['_inputs']) {
      cleanedOutputFileData['_inputs'] = {};
    }

    // Add each entry to our _inputs obj if not there already
    if (!cleanedOutputFileData['_inputs'][slugifiedInputKey]) {
      cleanedOutputFileData['_inputs'][slugifiedInputKey] = {
        label: inputTranslationObj.original,
        type: 'textarea',
        comment: translationLocations.join(','),
      };
    }

    // If entry doesn't exist in our output file, add it
    if (!cleanedOutputFileData[slugifiedInputKey]) {
      cleanedOutputFileData[slugifiedInputKey] = '';
    }

    // Only add the key to our output data if it still exists in base.json
    // If entry no longer exists in base.json we don't add it
    const outputKeys = Object.keys(outputFileData);
    outputKeys.forEach((key) => {
      if (slugifiedInputKey === key) {
        cleanedOutputFileData[key] = outputFileData[key];
      }
    });
  }

  fs.writeFile(
    translationFilePath,
    YAML.stringify(cleanedOutputFileData),
    (err) => {
      if (err) throw err;
      console.log(translationFilePath + ' updated succesfully');
    }
  );
}

// Loop through locales
for (let i = 0; i < locales.length; i++) {
  const locale = locales[i];

  main(locale).catch((err) => {
    console.error(`Encountered an error translating ${locale}:`, err);
  });
}

module.exports = { main };
