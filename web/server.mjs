import express from "express";
import * as fs from "fs";
import path from "path";
import url from "url";
import bodyParser from "body-parser";

import logger from "logger/index.mjs";

class Server {
  constructor(port, bind) {
    this.port = port;
    this.bind = bind !== null && bind !== "" ? bind : "0.0.0.0";
    this.app = express();
  }

  async start() {
    try {
      await this.#initMiddlewares();

      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: true }));

      await this.#initControllers();

      this.#listen();
    } catch (err) {
      logger.error(`Error on start server ${err}`);
    }
  }

  async stop() {
    await this.server.close();
  }

  async #initMiddlewares() {
    const ignoredFiles = ["base-middleware.mjs"];

    for (const module of this.#moduleImporter(ignoredFiles, "middlewares").sort(
      this.#sortModules
    )) {
      try {
        const loadedModule = await import(module);
        const middleware = new loadedModule.default(this.app);

        this.app.use(middleware.handle);
      } catch (err) {
        logger.error(`Error on loading middlewares ${err}`);
      }
    }
  }

  async #initControllers() {
    const ignoredFiles = ["base-controller.mjs"];

    for (const module of this.#moduleImporter(ignoredFiles, "controllers")) {
      try {
        const loadedModule = await import(module);
        const controller = new loadedModule.default();

        controller.loadRoutes();

        this.app.use(controller.getRouter());
      } catch (err) {
        logger.error(`Error on loading controllers ${err} - module ${module}`);
      }
    }
  }

  #moduleImporter(ignoredFiles, pathOfModule) {
    let modules = [];

    const currentFileFolder = path.dirname(url.fileURLToPath(import.meta.url));

    const modulePath = currentFileFolder + `/${pathOfModule}`;

    fs.readdirSync(modulePath).forEach(async (file) => {
      if (!ignoredFiles.includes(file)) {
        logger.info(`Loaded module from file ${modulePath}/${file}`);

        modules.push(`${modulePath}/${file}`);
      }
    });

    return modules;
  }

  #sortModules(firstModule, secondModule) {
    if (firstModule.getIndex() > secondModule.getIndex()) {
      return 1;
    }

    if (firstModule.getIndex() < secondModule.getIndex()) {
      return -1;
    }

    return 0;
  }

  #listen() {
    try {
      this.server = this.app.listen(this.port, this.bind);

      const address = this.server.address();

      logger.info(`Server started on host ${address.address}:${address.port}`);
    } catch (err) {
      logger.error(err);
    }
  }
}

export default Server;
