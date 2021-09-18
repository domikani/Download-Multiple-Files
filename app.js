//For newer versions of nodeJS that support ES modules the {import} statement can be used instead of the require -->
//To use the import statement we have to add in the package.json the following -->
// "type" : "module"
//For the rest of the code we have used commonJS and the require module

const Fs = require('fs');
const Path = require('path');
const Axios = require('axios');
const Chalk = require('chalk');
const authorities = require("./authorities");


const urlFileNames = ["mutated1", "mutated2", "mutated3", "mutated4"];
const outputFileNames = ["footpaths", "bridleways", "restrictedByways", "openByways"];
const authoritiesNames = authorities.authoritiesNameCodes;

let createFolderPath;

for (let name = 0; name < authoritiesNames.length; name++) {
    createFolderPath = authoritiesNames[name];

    if (!Fs.existsSync(createFolderPath)) {
        Fs.mkdirSync(`files/${createFolderPath}`);
    }
};


async function getData(urlFileName, outputFilename, authorityName) {
    const url = `http://www.rowmaps.com/jsons/${authorityName}/${urlFileName}.json`
    const path = Path.resolve(__dirname,'files', authorityName,`${outputFilename}.json`);
    
    const response = await Axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    });

    response.data.pipe(Fs.createWriteStream(path))

    return new Promise((resolve, reject) => {
        response.data.on('end', () => {
            resolve();

        });

        response.data.on('error', () => {
            reject(err);
        });

    })

}

const download = async (arrayOfCodeNames) => {
    let downloadedFiles = 0;
    for(let codeName=0; codeName<arrayOfCodeNames.length; codeName++){
        console.log(Chalk.cyan(`Download started for authority ${arrayOfCodeNames[codeName]}...`));
        for (let fileName = 0; fileName < urlFileNames.length; fileName++) {
            await getData(urlFileNames[fileName], outputFileNames[fileName],arrayOfCodeNames[codeName]).then(() => {
                console.log(`File: ${outputFileNames[fileName]}.json, downloaded for ${arrayOfCodeNames[codeName]}`);                
            });
            downloadedFiles++;            
        }
        console.log(Chalk.magenta(`Download finished for authority ${arrayOfCodeNames[codeName]}`));
        console.log('\n');
    }
    console.log(`Total downloaded files: ${Chalk.yellow(downloadedFiles)}`);
};

download(authoritiesNames);
    


