import { readFileSync } from 'node:fs';
import yamljs from 'yamljs';
import yaml from 'yaml';
import jsYaml from 'js-yaml';

const yamlParsers = {
  'yamljs': () => {
    return {
      parse: (input) => yamljs.parse(input),
      parseFile: (filename) => yamljs.parseFile(filename),
    };
  },
  'yaml': () => {
    const options = {
      // version: '1.1',
      // schema: 'core',
    };
    return {
      parse: (input) => yaml.parse(input, options),
      parseFile: (filename) => {
        const input = readFileSync(filename, 'utf8');
        return yaml.parse(input, options);
      },
    };
  },
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
