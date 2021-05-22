import Sequelize from "sequelize";
import * as fs from "fs";
import path from "path";
import url from "url";

class DBProvider {
  constructor(connectionString) {
    this.sequelize = new Sequelize(connectionString, {
      dialect: 'postgres'
    });
  }

  async connectToDB() {
    try {
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully");

      await this.#importAllModels();
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  async #importAllModels() {
    const currentFileFolder = path.dirname(url.fileURLToPath(import.meta.url));

    const modulePath = currentFileFolder + `/models`;

    for (const file of fs.readdirSync(modulePath)) {
      const model = await import(`./models/${file}`);
      if (model.init) {
        model.init(this.sequelize);
      } else {
        model.default.init(this.sequelize);
      }
    }
  }

  async closeConnection() {
    try {
      await this.sequelize.close();
      console.log("Connection closed");
    } catch (err) {
      console.error(err);
    }
  }
}

export default DBProvider;
