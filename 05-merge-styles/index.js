const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const dirName = path.join(__dirname, 'styles');
const bundleCSS = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
let filesForMerged = [];
let currentFile;
let stream;

async function main() {
  try {
    const files = await fsPromises.readdir(dirName, { withFileTypes: true });
    for (const file of files) {      
      if (file.isFile() && path.extname(file.name) === '.css') {
        filesForMerged.push(file.name);
      }
    }
    merge();
  } catch (err) {
    console.error(err);
  }
}

function merge() {
  if (!filesForMerged.length) {
    bundleCSS.end();
    return;
  }
  
  currentFile = path.join(dirName, filesForMerged.shift());
  stream = fs.createReadStream(currentFile);
  stream.pipe(bundleCSS, {end: false});
  bundleCSS.write('\n');
  stream.on('end', function() {
    merge();        
  });
}

main();