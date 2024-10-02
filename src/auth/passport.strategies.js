import passport from "passport";
import local from "passport-local";
import { UserController } from "../controllers/index.js";
import { isValidPassword, createHash, CustomError, errorDictionary } from "../services/index.js";

const localStrategy = local.Strategy;

const initAuthStrategies = () => {
  passport.use(
    "login",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const myUser = await UserController.findUsers({ email: username });

          const validation = isValidPassword(myUser, password);

          if (myUser && validation) {
            if (myUser.active == false)
              return done(
                "Tu usuario aún existe pero ha sido desactivado por falta de actividad. Por favor, contáctate con servicio técnico."
              );

            const updatedUser = await UserController.updateUsers(
                { email: username },
                { last_connection: req.date },
                { new: true, multi: false }
            );
            return done(null, updatedUser);
          } else {
            throw new CustomError(errorDictionary.AUTHORIZE_USER_ERROR, "Error al iniciar sesión");
          }
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const user = await UserController.findUsers({ email: username });
          
          if (user) return done(new CustomError(errorDictionary.AUTHORIZE_USER_ERROR, "Datos ya ocupados"), false);

          const newUser = {
            ...req.body,
            password: createHash(password),
            last_connection: req.date,
          };

          const result = await UserController.createUser(newUser);

          if (!result) throw new CustomError(errorDictionary.ADD_DATA_ERROR, "Usuario");

          return done(null, result);
        } catch (error) {
          return error;
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default initAuthStrategies;
