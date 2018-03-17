const fs = require("fs");


const files = fs.readdirSync("lastdays/");

const last48h = files.slice(files.length - 12 * 48, files.length);

console.log(files);

