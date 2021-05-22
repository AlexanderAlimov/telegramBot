import request from 'supertest';
import Server from "../../web/server.mjs";

const server = new Server(3000);
await server.start();

it('should return Hello Test', function (done) {
    request(server.app).get('/').expect({}).end(done);
});

server.stop();