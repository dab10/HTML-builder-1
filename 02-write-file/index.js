const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Приветствую!\nВведите данные для записи в text.txt\n');


stdin.on('data', data => {
  const dataString = data.toString().trim();

  if (dataString === 'exit') {
    stdout.write('Выход через "exit". Удачи!'); 
    process.exit();
  } else {
    fs.appendFile(path.join(__dirname, 'text.txt'), data, () => {});
  }
});

process.on('SIGINT', () => {
  stdout.write('Выход через Ctrl + C. Удачи!'); 
  process.exit();
});  