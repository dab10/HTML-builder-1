const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'files'), 
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;

    fs.rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true }, err => {
      if (err) throw err;

      fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
        if (err) throw err;
      });

      files.forEach(file => {
        fs.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name), (err) => {
          if (err) throw err;
        });
      });

    });
        
    fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
      if (err) throw err;
    });

    files.forEach(file => {
      fs.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name), (err) => {
        if (err) throw err;
      });
    });
    
  }
);