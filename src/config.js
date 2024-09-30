import dotenv from "dotenv";
import path from "path";
import * as url from "url";
import { Command } from "commander";

const Commandline = new Command();

Commandline
  .option("--mode <mode>", "Modo de trabajo", "devel")
  .option("--appname <appname>", "Nombre de la aplicación")
  .option("--port <port>", "Puerto de trabajo")
  .option("--secret <secret>", "Secret de activación")
  .option("--source <source>", "Fuente de datos")
  .option("--server <server>", "Nombre del servidor")
  .option("--mongouri <mongouri>", "URI de la BBDD de Atlas");
Commandline.parse();

export const CLOptions = Commandline.opts();

const envPath = path.join(
  process.cwd().includes("src") || process.cwd().includes("test")
    ? "../environment"
    : "./environment",
  `.env_${CLOptions.mode === "prod" ? "prod" : "devel"}`
);

dotenv.config({ path: envPath });

const { NODE_ENV, APP_NAME, PORT, SERVER, SECRET, DATA_SOURCE, MONGO_URI } = process.env;

const config = {
  MODE: CLOptions.mode || NODE_ENV,
  APP_NAME: CLOptions.appname || APP_NAME,
  PORT: CLOptions.port || PORT,
  DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)),
  SERVER: CLOptions.server || SERVER,
  SECRET: CLOptions.secret || SECRET,
  DATA_SOURCE: CLOptions.source || DATA_SOURCE,
  MONGO_URI: CLOptions.mongouri || MONGO_URI
};

export default config;
