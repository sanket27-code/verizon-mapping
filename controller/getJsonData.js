const fs = require('fs');
const path = require('path');
const dir = 'validated';

const verizonData = [];

fs.readdir(dir, (err, files) => {
    if (err) {
        console.log(err);
    } else {
        files.forEach(file => {
            if (path.extname(file) == '.json') {
                const data = JSON.parse(fs.readFileSync(`${dir}/${file}`, { encoding: 'utf8', flag: 'r' }));
                verizonData.push(data);
            }
        });
    }

    fs.writeFileSync('dbs/mergedJsonData.json', JSON.stringify(verizonData, null, 3));
})
