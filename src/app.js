// Imports
import mongoose from "mongoose";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import config, { CLOptions } from "./config.js";
import { initSocket, addLogger, errorHandler, generateCustomResponses }  from "./services/index.js";
import { authRoutes, gamesRoutes, messagesRoutes, roundsRoutes, usersRoutes } from "./routes/index.js";

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
app.use(
  session({
    secret: config.SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: config.MONGO_URI,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 28800,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: "lax"
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.set("socketServer", socketServer);
app.use(addLogger);
app.use(generateCustomResponses);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/rounds", roundsRoutes);
app.use("/api/users", usersRoutes);

// Static
app.use("/static", express.static(`${config.DIRNAME}/public`));

// Error
app.use(errorHandler);