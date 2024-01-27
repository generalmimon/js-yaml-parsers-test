#!/usr/bin/env bash
set -e

script_dir=$(dirname "$(readlink -f "${0}")")

mkdir -p "${script_dir}/results-diffs/"

gen_diff()
{
	git --no-pager diff --no-index --output "${script_dir}/results-diffs/${1}_vs_${2}.diff" -- "${script_dir}/results/${1}.txt" "${script_dir}/results/${2}.txt" || ex=$?
	if [ -z "${ex}" ] || [ "${ex}" -eq 1 ]; then
		return 0
	fi
	return "${ex}"
}

gen_diff yamljs js-yaml
gen_diff yaml-1.1 js-yaml
gen_diff yaml-1.2 js-yaml
gen_diff yaml-1.1 yaml-1.2
