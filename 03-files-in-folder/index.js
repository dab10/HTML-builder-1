const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'secret-folder'), 
  { withFileTypes: true },
  (err, files) => {
    console.log("Files in folder:");
    if (err) {
      console.log(err);
    } else {
      files.forEach(file => {
        if (file.isFile()) {
          let name = file.name.split('.').slice(0, 1).join('');
          let extension = path.extname(file.name).split('.').join('');
          fs.stat(path.join(__dirname, 'secret-folder', file.name), 
            (err, stats) => {
              if (err) throw err;
              let size = stats.size;
              console.log(`${name} - ${extension} - ${size}b`);
            });
        }
      });
    }
  });