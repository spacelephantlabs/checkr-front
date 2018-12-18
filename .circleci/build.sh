#!/bin/sh

set -e # if a command exit is > 0, exit script

yarn prettify:check
yarn lint
#yarn test # enable when there is at least one test
yarn prod
yarn check-no-modifications # check git workspace is unchanged after build
