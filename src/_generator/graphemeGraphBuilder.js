"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var os_1 = require("os");
var path_1 = require("path");
var prettier_1 = require("prettier");
var deduplicateArray_1 = require("../utils/deduplicateArray");
var readFiles = {};
var GraphemeGraphsByLanguage = {};
var definitionFileNames = fs_1.readdirSync(__dirname, "utf-8");
definitionFileNames.forEach(function (file) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (path_1.extname(file) === ".tsv") {
            readFiles[path_1.basename(file, ".tsv")] = fs_1.readFileSync("" + __dirname + path_1.sep + file, "utf-8");
        }
        return [2];
    });
}); });
Object.entries(readFiles).forEach(function (entry) {
    GraphemeGraphsByLanguage[entry[0]] = {};
    var rows = entry[1].split(os_1.EOL);
    rows.forEach(function (row) {
        var cols = row.split('\t');
        var graphemes = cols[2].split(', ');
        graphemes.forEach(function (grapheme) {
            if (!GraphemeGraphsByLanguage[entry[0]][grapheme]) {
                GraphemeGraphsByLanguage[entry[0]][grapheme] = [];
            }
            GraphemeGraphsByLanguage[entry[0]][grapheme] = GraphemeGraphsByLanguage[entry[0]][grapheme].concat(graphemes.filter(function (g) { return grapheme !== g; }));
        });
    });
    Object.entries(GraphemeGraphsByLanguage[entry[0]]).forEach(function (e) {
        e[1] = deduplicateArray_1.default(e[1]);
    });
});
var outputFile = "const GraphemesByLanguage = " + JSON.stringify(GraphemeGraphsByLanguage, null, 4) + ";" + os_1.EOL + os_1.EOL + "export default GraphemesByLanguage;" + os_1.EOL;
outputFile = prettier_1.format(outputFile, {
    tabWidth: 4,
    parser: "typescript"
});
fs_1.writeFileSync(path_1.resolve(__dirname, ".." + path_1.sep + "definitions" + path_1.sep + "GraphemeGraphs.ts"), outputFile);
//# sourceMappingURL=graphemeGraphBuilder.js.map