import { argv, exit } from 'node:process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { yamlParsers } from './yaml-parsers.js';

const args = argv.slice(2);

if (args.length < 2) {
  console.error(`Error: expected at least 2 arguments, but ${args.length} arguments given`);
  exit(1);
}

const yamlParserName = args[0];
if (!Object.hasOwn(yamlParsers, yamlParserName)) {
  console.log(`Error: expected one of ${JSON.stringify(Object.keys(yamlParsers))} as <yaml-parser>, but ${JSON.stringify(yamlParserName)} given`);
  exit(1);
}

const parseYamlFile = yamlParsers[yamlParserName]().parseFile;

const outdir = args[1];
if (!outdir) {
  console.error('Error: <outdir> argument must not be empty');
  exit(1);
}

const filenames = args.slice(2);

if (filenames.length < 1) {
  console.error('Error: at least one file must be given as argument');
  exit(1);
}

try {
  mkdirSync(outdir, { recursive: true });
} catch (e) {
  if (e.code === 'EEXIST') {
    // this is fine
  } else {
    throw e;
  }
}

for (const filename of filenames) {
  let yamlTree;
  try {
    yamlTree = parseYamlFile(filename);
  } catch (e) {
    const outputFilename = resolve(outdir, basename(filename, '.ksy') + '.err');
    console.log('writing', outputFilename);
    writeFileSync(outputFilename, e.toString());
    continue;
  }
  const outputFilename = resolve(outdir, basename(filename, '.ksy') + '.json');
  let output = JSON.stringify(yamlTree, null, 2);
  if (output.length !== 0 && output.at(-1) !== '\n') {
    output += '\n';
  }
  writeFileSync(outputFilename, output);
}
