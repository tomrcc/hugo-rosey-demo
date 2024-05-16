// TODO: Group translated and untranslated text with object groups using the $ syntax in _inputs
// TODO: If label is under 20 characters in length, make the input a text input instead of textarea
// TODO: probably didn't update the inputs properly, because we only make them once unless they change

const fs = require('file-system');
const YAML = require('yaml');
const slugify = require('slugify');

const inputFilePath = './rosey/base.json';
const translationFilesDirPath = './rosey/translations';
const baseURL = process.env.BASEURL || 'http://localhost:1313/';
let locales = process.env.LOCALES?.toLowerCase().split(',') || ['es-es'];
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

    // Only add the key to our output data if it still exists in base.json
    // If entry no longer exists in base.json we don't add it
    const outputKeys = Object.keys(outputFileData);
    outputKeys.forEach((key) => {
      if (inputKey === key) {
        cleanedOutputFileData[key] = outputFileData[key];
      }
    });

    // Add a link for each page the translation appears on, but not tags and categories pages
    const translationPages = Object.keys(inputTranslationObj.pages).filter(
      (page) => {
        return page !== 'tags/index.html' && page !== 'categories/index.html';
      }
    );

    // Get the locations of where a translation is mentioned
    const translationLocations = translationPages.map((page) => {
      const pageName =
        page === 'index.html' ? 'Homepage' : page.replace('/index.html', '');
      const pagePath = page.replace('/index.html', '/');
      return `[${pageName}](${baseURL}${pagePath})`;
    });

    // Add each entry to our _inputs obj - no need to preserve these between translations
    cleanedOutputFileData['_inputs'] = {};
    const label = inputTranslationObj.original;
    const inputType = label.length > 20 ? 'textarea' : 'text';
    cleanedOutputFileData['_inputs'][inputKey] = {
      label: label,
      type: inputType,
      comment: translationLocations.join(' | '),
    };

    // If entry doesn't exist in our output file, add it
    if (!cleanedOutputFileData[inputKey]) {
      cleanedOutputFileData[inputKey] = '';
    }
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
