import GraphemesByLanguage from "./definitions/GraphemeGraphs";

type Language = "en";

type RegExpOptions = {
    language: Language,
    returnType: "string"| "regex"
}

type PermutationsOptions = {
    language: Language,
    sortOrder: "alphabetical" | "levenshtein",
    keepOriginal: boolean
}

const regexConsonant = "[b-df-hj-np-tv-z]";

/**
 * Generate a Regular Expression (or its string format equivalent) which simultaneously matches all graphemes of the supplied term.
 * 
 * For example:
 * `getCombinedRegExp("boy")` -> `/^(b|bb)(oy|oi|uoy)$/`
 * 
 * @param term The search term.
 * @param options 
 */
export function getCombinedRegExp(term: string, options?: RegExpOptions): string | RegExp {
    let result = "";

    if (!GraphemesByLanguage[options.language]) {
        throw new Error(`Grapheme language ${options.language} not supported.`);
    }

    let graphemeLanguage = GraphemesByLanguage[options.language];

    switch (options.returnType) {
        case "regex":
            return new RegExp(result);

        default:
            return result;
    }
}

/**
 * Returns all possible graphemic permutations of the search, note that this will scale _very_ quickly with the length of the term, particularly if it contains many vowels.
 * 
 * @param term The search term.
 * @param options 
 */
export function listPermutations(term: string, options?: PermutationsOptions): Array<string> {
    let results: Array<string> = [];
    
    let singleCharacterPermutationMap: Map<string, Array<string>> = new Map<string, Array<string>>();

    for (let i = 0; i < term.length; i++) {
        singleCharacterPermutationMap.set(term.charAt(i), _singleCharacterSubstitution(term.charAt(i), options.language));
    }

    let numberOfPermutations = 1;

    for (let i = 0; i < term.length; i++) {
        numberOfPermutations *= singleCharacterPermutationMap.get(term.charAt(i)).length;
    }
    
    console.log(singleCharacterPermutationMap.entries().next());
    console.log(numberOfPermutations);

    return results;
}

function _singleCharacterSubstitution(char: string, language: Language): Array<string> {
    if (char.length !== 1) {
        throw new Error(`Not a single character: ${char}`);
    }

    let graphemes = [char];

    if (!graphemes) {
        console.warn(`No graphemes found in language ${language} for "${char}".`);
        return [char];
    } else {
        graphemes = graphemes.concat(GraphemesByLanguage[language][char]);
        return graphemes;
    }
}