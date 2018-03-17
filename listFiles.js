const fs = require("fs");
if (process.argv.length === 4) {
    const files = fs.readdirSync(process.argv[2]);
    const last48h = files.slice(files.length - 12 * 48, files.length);
    fs.writeFileSync(process.argv[3]+"files.json", JSON.stringify(last48h));
} else {
    console.log("USAGE: node listFiles.js <dir> <output>")
}




