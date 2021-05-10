#!/usr/bin/env bash

DEV_KEY="dev"
PROD_KEY="prod"

if [ "$1" = "$DEV_KEY" ]; then
    \cp ./env/dev.env ./bot/.env
fi

if [ "$1" = "$PROD_KEY" ]; then
    \cp ./env/production.env ./bot/.env
fi

npm pack ./db
npm pack ./logger
mv *.tgz modules/

cd bot
npm i
rm -rf ./node_modules/db
npm update db
rm -rf ./node_modules/logger
npm update logger

cd ..
