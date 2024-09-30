// Imports
import mongoose from "mongoose";
import config from "./config.js";
import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import { CLOptions } from "./config.js";
import { initSocket }  from "./services/index.js";

// Server init
const app = express();
const httpServer = app.listen(config.PORT, async () => {
    await mongoose.connect(config.MONGO_URI);
  console.log(
    `[CL_OPTIONS]:`, 
    CLOptions, 
    "\n", 
    `Servidor activo en el puerto ${config.PORT}, conectado a [${config.DATA_SOURCE}]:'${config.SERVER}', [PID]: ${process.pid}.`
  );
});
const socketServer = initSocket(httpServer);

// Settings & app middlewares:

// General
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.SECRET));
app.use(passport.initialize());
app.use(passport.session());
app.set("socketServer", socketServer);

// Routes

// Static
app.use("/static", express.static(`${config.DIRNAME}/public`));