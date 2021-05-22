npm pack ../web

mv *.tgz ./web/app

tar -C ./web/app -xvf ./web/app/telegrambot-0.0.1.tgz --strip-components 1

rm ./web/app/telegrambot-0.0.1.tgz