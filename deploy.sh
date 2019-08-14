#!/bin/sh
set -eu

toplevel="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
cd "${toplevel}"
rm -rf dist
rm -rf docs
yarn && yarn build
cp -r dist docs

printf '\n'
printf 'Please review the build output now---run:\n'
printf '    cd docs && python -m SimpleHTTPServer\n'
printf 'If you want to deploy, then add changes to docs and push.\n'

