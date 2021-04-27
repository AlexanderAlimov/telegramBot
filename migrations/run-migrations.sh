#!/usr/bin/env bash

DEV_KEY="dev"
PROD_KEY="prod"

CONNECTION_STRING=""

if [ "$1" = "$DEV_KEY" ]; then
  CONNECTION_STRING="postgres://postgres:postgres@localhost:5432/telegramBotDB"

  ./node_modules/.bin/sequelize-cli db:migrate --url $CONNECTION_STRING
  exit 0;
fi

if [ "$1" = "$PROD_KEY" ]; then
  CONNECTION_STRING="postgres://postgres:postgres@localhost:5432/telegramBotDB"

  ./node_modules/.bin/sequelize-cli db:migrate --url $CONNECTION_STRING
  exit 0;
fi


