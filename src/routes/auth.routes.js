import passport from "passport";
import initAuthStrategies from "../auth/passport.strategies.js";
import { UserController } from "../controllers/index.js";
import { CustomRouter, CustomError, errorDictionary } from "../services/index.js";

initAuthStrategies();

class AuthRouterManager extends CustomRouter {
    init() {
        this.post("/login", "PUBLIC", ["email", "password"], passport.authenticate("login", { failureRedirect: `/login?error=${encodeURI("Usuario y/o clave no válidos.")}` }), async (req, res) => {
            try {
                req.session.user = req.user;
                req.session.save(async (error) => {
                  if (error) throw new CustomError(errorDictionary.SESSION_ERROR, `${error}`);
                  await req.logger.info(`${req.date} Usuario "${req.session.user.email}" logueado; Sesión almacenada. | ::[${req.url}]`);
                  res.redirect("/products");
                });
            } catch (error) {
                throw error;
            }
        });
        this.post("/register", "PUBLIC", ["nickname", "email", "password"], passport.authenticate("register", { failureRedirect: `/register?error=${encodeURI("Email y/o contraseña no válidos.")}` }), async (req, res) => {
            try {
                req.session.user = req.user;
                req.session.save(async (error) => {
                  if (error) throw new CustomError(errorDictionary.SESSION_ERROR, `${error}`);
                  await req.logger.info(`${req.date} Usuario "${req.session.user.email}" registrado; Sesión almacenada. | ::[${req.url}]`);
                  res.redirect("/products");
                });
            } catch (error) {
                throw error;
            }
        });
        this.post("/logout", ["USER", "ADMIN"], "NOFIELDS", async (req, res) => {
            try {
                const email = (await req.session.user) ? req.session.user.email : undefined;
                if (!email) throw new CustomError(errorDictionary.SESSION_ERROR);
                req.session.destroy(async (error) => {
                  if (error) throw new CustomError(errorDictionary.SESSION_ERROR, `${error}`);
                  const updating = await UserController.updateUsers(
                    { email: email },
                    { last_connection: req.date },
                    { new: true, multi: false }
                  );
                  if (!updating) throw new CustomError(errorDictionary.UPDATE_DATA_ERROR, "Usuario");
                  await req.logger.info(`${req.date} Usuario "${email}" cerró sesión; Sesión destruída. | ::[${req.url}]`);
                  res.redirect("/login");
                });
            } catch (error) {
                res.send(error);
            }
        });
    }
};

const authRouter = new AuthRouterManager().getRouter();

export default authRouter;