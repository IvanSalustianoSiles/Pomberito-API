import config from "../config.js";
import { Router } from "express";
import { CustomError, errorDictionary } from "./error.handler.js";
import { GameController, MessageController, RoundController, UserController } from "../controllers/index.js";

class CustomRouter {
  constructor() {
    this.router = Router();
    this.init();
  }
  
  init() {};
  
  getRouter() {
    return this.router;
  };
  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params); // apply ejecuta una función aplicando ciertos parámetros, y hay que decir a qué scout pertenecen, a this porque es del uso interno de la clase.
      } catch (error) {
        console.error(error);
        params[1]
          .status(500)
          .send({ origin: config.SERVER, error: `[ERROR]: ${error}` });
      }
    });
  };
  verifyRequiredBody(requiredFields) {
    return async (req, res, next) => {
      try {
        if (requiredFields == "NOFIELDS") return next();
        const allOk = requiredFields.every((field) => {
          return (
            req.body.hasOwnProperty(field) &&
            req.body[field] !== "" &&
            req.body[field] !== null &&
            req.body[field] !== undefined
          );
        });      
        if (!allOk) throw new CustomError(errorDictionary.FEW_PARAMS_ERROR, `${requiredFields}`);   
        return next();
      } catch (error) {
        throw error;
      }
    }
  };
  handlePolicies(policies) {
    return async (req, res, next) => {
      try {   
        if (policies === "PUBLIC") return next();
        let user = req.session.user;
        if (!user) res.redirect("/login");
        let role = user.role.toUpperCase();
        if (!policies.includes(role)) throw new CustomError(errorDictionary.AUTHORIZE_USER_ERROR, `Rol ${user.role} no permitido.`);
        req.user = user;
        return next();
      } catch (error) {
        throw error;
      }
    }
  };
  verifyMDBID(ids, check) {
    return async (req, res, next) => {
      try {
        if (ids == "NOIDS") return next();
        for (let i = 0; i < ids.length; i++) {
          let id = ids[i];
          if (typeof(req.params[id]) === "object") req.params[id] = JSON.parse(JSON.stringify(req.params[id]));
          if (!config.MONGODB_ID_REGEX.test(req.params[id])) throw new CustomError(errorDictionary.AUTHORIZE_ID_ERROR, `${req.params[id]}`);
        } 
        switch (true) {
          case req.params["gid"]:
            const game = await GameController.findGames({ _id: req.params["gid"]});
            if (!game) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, "Partida");
            if (check == "COMPARE" && req.session.user.role.toUpperCase() != "ADMIN") {
              const gamePlayer = await game.players.find(player => player.uid == req.session.user._id);
              if (!gamePlayer) throw new CustomError(errorDictionary.AUTHORIZE_USER_ERROR);
            };
          break;
          case req.params["mid"]:
            const message = await MessageController.findMessages({ _id: req.params["mid"]});
            if (!message) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, "Mensaje");
            if (check == "COMPARE" && req.session.user.role.toUpperCase() != "ADMIN") {
              const messageOwnerValidation = message.uid == req.session.user._id; 
              if (!messageOwnerValidation) throw new CustomError(errorDictionary.AUTHORIZE_ID_ERROR); 
            };
          break;
          case req.params["rid"]:
            const round = await RoundController.findRounds({ _id: req.params["rid"]});
            if (!round) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, "Mano");
            if (check == "COMPARE" && req.session.user.role.toUpperCase() != "ADMIN") {
              const roundPlayer = await round.players.find(player => player.uid == req.session.user._id);
              if (!roundPlayer) throw new CustomError(errorDictionary.AUTHORIZE_USER_ERROR);
            };
          break;
          case req.params["uid"]:
            const user = await UserController.findUsers({ _id: req.params["uid"]});
            if (!user) throw new CustomError(errorDictionary.FOUND_USER_ERROR);
            if (check == "COMPARE" && req.session.user.role.toUpperCase() != "ADMIN") {
              const userValidation = user._id == req.session.user._id;
              if (!userValidation) throw new CustomError(errorDictionary.AUTHORIZE_ID_ERROR);
            };
          break;
        };
        return next();
      } catch (error) {
        throw error;
      } 
    };
  };
  routeDate() {
    return async (req, res, next) => {
      try {
        const routeDate = new Date();
        if (!routeDate) throw new CustomError(errorDictionary.GENERATE_DATA_ERROR, "Fecha");
        req.date = routeDate;
        return next();
      } catch (error) {
        throw error;
      }
    }
  };
  get(path, policies, ...callbacks) { 
    this.router.get(
      path,
      this.routeDate(),
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  };
  post(path, policies, requiredFields, ...callbacks) {
    this.router.post(
      path,
      this.routeDate(),
      this.handlePolicies(policies),
      this.verifyRequiredBody(requiredFields),
      this.applyCallbacks(callbacks)
    );
  };
  put(path, policies, requiredFields, ...callbacks) {
    this.router.put(
      path,
      this.routeDate(),
      this.handlePolicies(policies),
      this.verifyRequiredBody(requiredFields),
      this.applyCallbacks(callbacks)
    );
  };
  delete(path, policies, requiredFields, ...callbacks) {
    this.router.delete(
      path,
      this.routeDate(),
      this.handlePolicies(policies),
      this.verifyRequiredBody(requiredFields),
      this.applyCallbacks(callbacks)
    );
  };
  getById(path, policies, ids, check, ...callbacks) {
    this.router.get(
      path,
      this.routeDate(),
      this.handlePolicies(policies),
      this.verifyMDBID(ids, check),
      this.applyCallbacks(callbacks)
    );
  };
  postById(path, policies, requiredFields, ids, check, ...callbacks) {
    this.router.post(
      path,
      this.routeDate(),
      this.handlePolicies(policies),
      this.verifyMDBID(ids, check),
      this.verifyRequiredBody(requiredFields),
      this.applyCallbacks(callbacks)
    );
  };
  putById(path, policies, requiredFields, ids, check, ...callbacks) {
    this.router.put(
      path,
      this.routeDate(),
      this.handlePolicies(policies),
      this.verifyMDBID(ids, check),
      this.verifyRequiredBody(requiredFields),
      this.applyCallbacks(callbacks)
    );
  };
  deleteById(path, policies, requiredFields, ids, check, ...callbacks) {
    this.router.delete(
      path,
      this.routeDate(),
      this.handlePolicies(policies),
      this.verifyMDBID(ids, check),
      this.verifyRequiredBody(requiredFields),
      this.applyCallbacks(callbacks)
    );
  };
};

export default CustomRouter;