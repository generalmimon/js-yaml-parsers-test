import { argv, exit } from 'node:process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { inspect } from 'node:util';
import { yamlParsers } from './yaml-parsers.js';

const args = argv.slice(2);

if (args.length !== 1) {
  console.error(`Error: expected 1 argument, but ${args.length} arguments given`);
  exit(1);
}

const outdir = args[0];
if (!outdir) {
  console.error('Error: <outdir> argument must not be empty');
  exit(1);
}

const testCases = [
  {
    url: "https://github.com/kaitai-io/kaitai_struct_webide/issues/63",
    input: `size: 0x30150-0x30010`,
  },

  {
    url: "https://github.com/kaitai-io/kaitai_struct/issues/456",
    input: `instances:
  compressed:
    io: _root._io
    pos: 0x44 + _parent.compression_header_size + offset
    size: size`,
  },

  {
    url: "https://github.com/kaitai-io/kaitai_struct_webide/issues/150",
    input: `enums:
  my_enum:
    0b011: a
    0b110: b`
  },

  {
    url: "https://app.gitter.im/#/room/!UakDfENneauyHdHlha:gitter.im/$gFobsc4usSV1dvgBUar_u_1zlAtn4w6YC9BXwHx0YwY",
    input: `value: 0b10101010`,
  },

  {
    url: "https://github.com/kaitai-io/kaitai_struct_webide/issues/27",
    input: `seq:
  - id: stringdemo
    size: 0
    doc: This is a flow-style
      multi-line string`,
  },

  {
    url: "https://doc.kaitai.io/user_guide.html#_ternary_if_then_else_operator",
    input: `instances:
  foo:
    value: condition ? 4 : 8`,
  },

  {
    url: "https://app.gitter.im/#/room/#kaitai_struct_Lobby:gitter.im/$U6Oydw-sZNk4w1eHjLpZ9Y7cAsn6j7UD1n_F8BB0lhw",
    input: `my_enum:
  0: off
  1: on`,
  },

  {
    url: "https://yaml.org/type/bool.html",
    input: `yaml_1_1_only_truths: [y, Y, yes, Yes, YES, on, On, ON]
yaml_1_1_only_falses: [n, N, no, No, NO, off, Off, OFF]
yaml_1_2_core_schema_truths: [true, True, TRUE]
yaml_1_2_core_schema_falses: [false, False, FALSE]`,
  },

  {
    url: "https://app.gitter.im/#/room/#kaitai_struct_Lobby:gitter.im/$BYFX0GrJSMtXGQNrQm4nhFm9rbQ2miN0iOuWElVRVDc",
    input: `foo: bar::baz`,
  },

  {
    url: "https://app.gitter.im/#/room/#kaitai_struct_Lobby:gitter.im/$jobD9SGEY6uln6PeBbbQ2Zy2Qmi1N95I4bsf5KsFJVc",
    input: `value: '"this is a single quote: ''"'`,
  },

  {
    url: "https://app.gitter.im/#/room/!UakDfENneauyHdHlha:gitter.im/$BwKJj1ErCmpZSCJoS_BIkY_v9BAnHhSACsJcbt1gNeA",
    input: `cases:
  package_type::pt_response: egts_pt_response`,
  },

  {
    url: "https://yaml.org/type/int.html (YAML 1.1)",
    input: `canonical: 685230
decimal: +685_230
octal: 02472256
hexadecimal: 0x_0A_74_AE
binary: 0b1010_0111_0100_1010_1110
sexagesimal: 190:20:30`,
  },

  {
    url: "https://yaml.org/spec/1.2.2/#example-integers",
    input: `canonical: 12345
decimal: +12345
octal: 0o14
hexadecimal: 0xC`,
  },

  {
    url: ["https://yaml.org/spec/1.1/#id858801", "https://yaml.org/spec/1.2.2/#example-timestamps"],
    input: `canonical: 2001-12-15T02:59:43.1Z
iso8601: 2001-12-14t21:59:43.10-05:00
spaced: 2001-12-14 21:59:43.10 -5
date: 2002-12-14`,
  },

  {
    url: "https://github.com/kaitai-io/kaitai_struct_tests/blob/7d7ecf076cc02c5032ec399655b7c3d50bde96ad/formats_err/yaml_1.ksy",
    input: `meta:
  id: yaml_1
    seq:`,
  },

  {
    url: "https://github.com/kaitai-io/kaitai_struct_tests/blob/7d7ecf076cc02c5032ec399655b7c3d50bde96ad/formats_err/yaml_dup_keys.ksy",
    input: `meta:
  id: yaml_dup_keys
seq:
  - id: foo
    type: u1
seq:
  - id: bar
    type: u1`,
  },

  {
    url: "https://medium.com/@P0lip/yaml-is-great-but-dont-use-it-2d02a60181ab#ffe6",
    input: `2: "bar"
"2": "foo"`,
  },

  {
    url: "https://github.com/kaitai-io/kaitai_struct_webide/issues/62",
    input: `# Line 1
# Line 2
# Line 3
# Line 4
types:
  animal:
      doc: An animal species
    seq:  # line 8, but yaml.js says line 4!
      - id: species
        type: s4`,
  },

  {
    url: "https://github.com/kaitai-io/kaitai_struct/issues/693",
    input: `{
  "doc": "json test",
  "meta": {
    "id": "test",
    "endian": "le"
  },
  "seq": [
    {
      "id": "version",
      "contents": [
        1,
        255,
        255,
        255
      ],
      "doc": "4 - structure version"
    }
  ]
}`,
  },

  {
    url: "https://github.com/nodeca/js-yaml/pull/480",
    input: `{ toString: !<tag:yaml.org,2002:js/function> 'function (){return Date.now()}' } : 1`,
  },
];

try {
  mkdirSync(outdir, { recursive: true });
} catch (e) {
  if (e.code === 'EEXIST') {
    // this is fine
  } else {
    throw e;
  }
}

for (const [yamlParserName, initParser] of Object.entries(yamlParsers)) {
  const parseYaml = initParser().parse;
  const outputFilename = resolve(outdir, yamlParserName + '.txt');
  let output = '';
  for (const testCase of testCases) {
    if (Array.isArray(testCase.url)) {
      output += testCase.url.join(' | ') + '\n';
    } else {
      output += testCase.url + '\n';
    }
    output += testCase.input + '\n';
    try {
      output += inspect(parseYaml(testCase.input), { depth: null }) + '\n';
    } catch (e) {
      output += 'ERROR:\n';
      output += e.toString().replace(/^/gm, '> ').replace(/\s+$/gm, '') + '\n';
    }
    output += '\n';
  }
  output = output.trimEnd();
  output += '\n';
  console.log('writing', outputFilename);
  writeFileSync(outputFilename, output);
}
