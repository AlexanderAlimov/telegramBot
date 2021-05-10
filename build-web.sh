#!/usr/bin/env bash

DEV_KEY="dev"
PROD_KEY="prod"

if [ "$1" = "$DEV_KEY" ]; then
    \cp ./env/dev.env ./web/.env
fi

if [ "$1" = "$PROD_KEY" ]; then
    \cp ./env/production.env ./web/.env
fi


npm pack ./db
npm pack ./logger
npm pack ./config
mv *.tgz modules/

cd web
npm i
rm -rf ./node_modules/db
npm update db
rm -rf ./node_modules/logger
npm update logger
rm -rf ./node_modules/config
npm update config

cd ..
