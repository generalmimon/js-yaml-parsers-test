#!/usr/bin/env bash
set -e

script_dir=$(dirname "$(readlink -f "${0}")")

mkdir -p "${script_dir}/results-diffs/"

git diff --no-index --output "${script_dir}"/results-diffs/yamljs_vs_js-yaml.diff -- "${script_dir}"/results/{yamljs,js-yaml}.txt || ex=$?
[ -z "${ex}" ] || [ "${ex}" -eq 1 ]
git diff --no-index --output "${script_dir}"/results-diffs/yaml_vs_js-yaml.diff -- "${script_dir}"/results/{yaml,js-yaml}.txt || ex=$?
[ -z "${ex}" ] || [ "${ex}" -eq 1 ]
