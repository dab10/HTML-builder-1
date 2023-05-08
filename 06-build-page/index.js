const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

//ASSETS

async function createDir(dir) {
  try {
    await fsPromises.mkdir(dir, {recursive: true});
  } catch (err) {
    console.error(err);
  }
}

async function removeDir(dir) {
  try {
    await fsPromises.rm(dir, {force: true, recursive: true});
  } catch (err) {
    console.error(err);
  }
}

async function copyAssets(sourceFolder, projectDistFolder) {
  try {
    await createDir(projectDistFolder);
    const files = await fsPromises.readdir(sourceFolder, { withFileTypes: true });

    files.forEach(file => {
      if (file.isFile()) {
        fs.copyFile(path.join(sourceFolder, file.name), path.join(projectDistFolder, file.name), (err) => {
          if (err) throw err;
        });
      } else if (file.isDirectory()) {
        copyAssets(path.join(sourceFolder, file.name), path.join(projectDistFolder, file.name));
      }
    });

  } catch (err) {
    console.error(err);
  }
}

// CSS

let filesForMerged = [];
let currentFile;
let stream;

async function makeCSS() {
  try {
    const bundleCSS = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
    const files = await fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
    for (const file of files) {      
      if (file.isFile() && path.extname(file.name) === '.css') {
        filesForMerged.push(file.name);
      }
    }
    merge(bundleCSS);
  } catch (err) {
    console.error(err);
  }
}

function merge(bundleCSS) {

  if (!filesForMerged.length) {
    bundleCSS.end();
    return;
  }
  
  currentFile = path.join(path.join(__dirname, 'styles'), filesForMerged.shift());
  stream = fs.createReadStream(currentFile);
  stream.pipe(bundleCSS, {end: false});
  bundleCSS.write('\n');
  stream.on('end', function() {
    merge(bundleCSS);        
  });
}

//HTML

let replacement = '';

async function replacementHTML(file) {
  try {
    await fsPromises.readFile(path.join(__dirname, 'components', file.name))
      .then(function(result) {
        return replacement = result.toString();
      })
      .catch(function(error) {
        console.log(error);
      });
  } catch (err) {
    console.error(err);
  }
}

async function dataHTML() {
  try {
    const files = await fsPromises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
    let tempHTML = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8');

    for (const file of files) {
      await replacementHTML(file);

      let nameTag = `{{${file.name.split('.').slice(0, 1).join('')}}}`;
      let replaceThis = nameTag;
      let re = new RegExp(replaceThis);
      tempHTML = tempHTML.replace(re, replacement);

      const resHTML = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
      resHTML.write(tempHTML);
    }
  } catch (err) {
    console.error(err);
  }
}



async function makeBundle() {
  await removeDir(path.join(__dirname, 'project-dist'))
  await copyAssets(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
  await makeCSS();
  await dataHTML();
}

makeBundle();

