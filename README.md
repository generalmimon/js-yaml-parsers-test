# Test JavaScript YAML parsers

Compare 3 YAML parsers available in the JS ecosystem:

* https://github.com/jeremyfa/yaml.js
* https://github.com/nodeca/js-yaml
* https://github.com/eemeli/yaml

## Usage

* `./run.sh` - runs test cases specified in [index.js](./index.js) on all YAML parsers, resulting in log files written to [results/](./results/):

  ```
  results/
  ├── js-yaml.txt
  ├── yaml.txt
  └── yamljs.txt
  ```

* `./parse.sh <ks_base_dir>` - parses 3 sets of YAML files, converts them to JSON and writes `.json` files to `out/`:

  * https://github.com/kaitai-io/kaitai_struct_formats
  * https://github.com/kaitai-io/kaitai_struct_tests/tree/master/formats
  * https://github.com/kaitai-io/kaitai_struct_tests/tree/master/formats_err

  Requires the `<ks_base_dir>` parameter (path to a full clone of https://github.com/kaitai-io/kaitai_struct).

  The resulting folder structure looks like this:

  ```
  out/
  ├── js-yaml/
  │   ├── ksf/
  │   ├── kst/
  │   └── kst_err/
  ├── yaml/
  │   ├── ksf/
  │   ├── kst/
  │   └── kst_err/
  └── yamljs/
      ├── ksf/
      ├── kst/
      └── kst_err/
  ```

  This makes it easy to compare the results of YAML parsers between each other, for example:

  ```
  git diff --no-index out/{yamljs,js-yaml}/
  ```
