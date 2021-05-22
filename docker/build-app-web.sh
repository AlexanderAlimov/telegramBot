DEV_KEY="dev"
PROD_KEY="prod"

if [ "$1" = "$DEV_KEY" ]; then
    \cp ../env/dev.env ../deploy/.env
fi

if [ "$1" = "$PROD_KEY" ]; then
    \cp ../env/production.env ../deploy/.env
fi

# TODO: Сделать проверку на отсутствие аргумента. Обязательно хотя бы 1 параметр должен быть указан

npm pack ../db
npm pack ../logger
npm pack ../config

mv *.tgz ./modules/

rm -rf ./web/app

npm pack ../web

mkdir -p ./web/app/

mv *.tgz -C ./web/app/

tar -C ./web/app -xvf ./web/app/telegrambot-0.0.1.tgz --strip-components 1

rm ./web/app/telegrambot-0.0.1.tgz 

docker build -f web/Dockerfile -t telegram-bot .
