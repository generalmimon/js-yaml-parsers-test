#!/usr/bin/env bash
set -e

script_dir=$(dirname "$(readlink -f "${0}")")

if [ "$#" -ne 1 ]; then
	echo "Usage: ${0} <ks_base_dir>" >&2
	exit 1
fi

ks_base_dir=$1

if [ ! -d "${ks_base_dir}" ]; then
	echo "Error: <ks_base_dir> must be a directory" >&2
	exit 1
fi

ks_base_dir=$(readlink -f "${ks_base_dir}")
parse_js=${script_dir}/parse.js
out_dir=${script_dir}/out

for yaml_parser in yamljs yaml-1.2 yaml-1.1 js-yaml
do
	echo "${yaml_parser}"
	find "${ks_base_dir}"/formats -type f -iname '*.ksy' -execdir node "${parse_js}" "${yaml_parser}" "${out_dir}/${yaml_parser}/ksf" {} +
	find "${ks_base_dir}"/tests/formats -type f -iname '*.ksy' -execdir node "${parse_js}" "${yaml_parser}" "${out_dir}/${yaml_parser}/kst" {} +
	find "${ks_base_dir}"/tests/formats_err -type f -iname '*.ksy' -execdir node "${parse_js}" "${yaml_parser}" "${out_dir}/${yaml_parser}/kst_err" {} +
	echo
done
