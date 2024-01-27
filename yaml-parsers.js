import { readFileSync } from 'node:fs';
import yamljs from 'yamljs';
import yaml from 'yaml';
import jsYaml from 'js-yaml';

function yamlLibrary(options) {
  return {
    parse: (input) => yaml.parse(input, options),
    parseFile: (filename) => {
      const input = readFileSync(filename, 'utf8');
      return yaml.parse(input, options);
    },
  };
}

const yamlParsers = {
  'yamljs': () => {
    return {
      parse: (input) => yamljs.parse(input),
      parseFile: (filename) => yamljs.parseFile(filename),
    };
  },
  'yaml-1.2': yamlLibrary.bind(null, { version: '1.2' }),
  'yaml-1.1': yamlLibrary.bind(null, { version: '1.1' }),
  'js-yaml': () => {
    const yamlParser = jsYaml;
    const options = {
      schema: yamlParser.CORE_SCHEMA,
      filename: 'input.ksy',
    };
    return {
      parse: (input) => yamlParser.load(input, options),
      parseFile: (filename) => {
        const input = readFileSync(filename, 'utf8');
        return yamlParser.load(input, options);
      },
    };
  },
};

export { yamlParsers };
