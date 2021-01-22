import { readdirSync, readFileSync, writeFileSync } from "fs";
import { EOL } from "os";
import { basename, extname, resolve, sep } from "path";
import { format } from "prettier";
import deduplicateArray from "../utils/deduplicateArray";

let readFiles = {};

interface GraphemeGraph {
    [k: string]: Array<string>;
}

const GraphemeGraphsByLanguage: {[k: string]: GraphemeGraph} = {};

let definitionFileNames = readdirSync(__dirname, "utf-8");
definitionFileNames.forEach(async file => {
    if (extname(file) === ".tsv") {
        readFiles[basename(file, ".tsv")] = readFileSync(`${__dirname}${sep}${file}`, "utf-8");
    }
});

Object.entries(readFiles).forEach((entry: [string, string]) => {
    GraphemeGraphsByLanguage[entry[0]] = {};
    let rows = entry[1].split(EOL);
    rows.forEach(row => {
        let cols = row.split('\t');
        let graphemes = cols[2].split(', ');
        graphemes.forEach(grapheme => {
            if (!GraphemeGraphsByLanguage[entry[0]][grapheme]) {
                GraphemeGraphsByLanguage[entry[0]][grapheme] = [];
            }
            GraphemeGraphsByLanguage[entry[0]][grapheme] = GraphemeGraphsByLanguage[entry[0]][grapheme].concat(graphemes.filter(g => grapheme !== g));
        });
    });

    Object.entries(GraphemeGraphsByLanguage[entry[0]]).forEach((e: [string, Array<string>]) => {
        e[1] = deduplicateArray(e[1]);
    });
});

let outputFile = `const GraphemesByLanguage = ${JSON.stringify(GraphemeGraphsByLanguage, null, 4)};${EOL}${EOL}export default GraphemesByLanguage;${EOL}`;
outputFile = format(outputFile, {
    tabWidth: 4,
    parser: "typescript"
});

writeFileSync(resolve(__dirname, `..${sep}definitions${sep}GraphemeGraphs.ts`), outputFile);