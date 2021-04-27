#!/usr/bin/env bash

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
