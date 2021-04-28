import Boss from './servises/pg-boss/pg-boss.mjs'

const scheduler = new Boss(
    'postgres://postgres:postgres@127.0.0.1/telegramBotDB');

export default scheduler;

