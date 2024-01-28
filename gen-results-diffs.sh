#!/usr/bin/env bash
set -e

script_dir=$(dirname "$(readlink -f "${0}")")
cd -- "${script_dir}"

mkdir -p results-diffs/

gen_diff()
{
	git --no-pager diff -U1000 --no-index --output "results-diffs/${1}_vs_${2}.diff" -- "results/${1}.txt" "results/${2}.txt" || ex=$?
	if [ -z "${ex}" ] || [ "${ex}" -eq 1 ]; then
		return 0
	fi
	return "${ex}"
}

gen_diff yamljs js-yaml
gen_diff yaml-1.1 js-yaml
gen_diff yaml-1.2 js-yaml
gen_diff yaml-1.1 yaml-1.2
