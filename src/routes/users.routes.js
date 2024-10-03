import { UserController } from "../controllers/index.js";
import { CustomRouter, CustomError, errorDictionary } from "../services/index.js";

class UsersRouterManager extends CustomRouter {
    init() {
        this.get("/", ["ADMIN"], async (req, res) => {
            try {
                const users = await UserController.findUsers({}, { multi: true });
                if (!users) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, "Usuarios");
                req.logger.warning(`El usuario ${req.session.user.email} ha ingresado a una ruta privada. Procura que sea un administrador del sitio. | ::${req.url}`);
                res.sendSuccess(users);
            } catch (error) {
                throw error;
            }
        });
        this.getById("/:uid", ["USER", "ADMIN"], ["uid"], "COMPARE", async (req, res) => {
            try {
                const { uid } = req.params;
                const user = await UserController.findUsers({ _id: uid }, { multi: false });
                if (!user) throw new CustomError(errorDictionary.FOUND_USER_ERROR, `${uid}`);
                res.sendSuccess(user);
            } catch (error) {
                throw error;
            }
        });
        this.post("/", ["ADMIN"], ["userData"], async (req, res) => {});
        this.put("/", ["ADMIN"], ["filters", "updates"], async (req, res) => {});
        this.putById("/:uid", ["USER", "ADMIN"], ["updatedData"], ["uid"], "COMPARE", async (req, res) => {});
        this.delete("/", ["ADMIN"], ["filters"], async (req, res) => {});
        this.deleteById("/:uid", ["ADMIN", "USER"], "NOFIELDS", ["uid"], "COMPARE", async (req, res) => {});
    }
};

const usersRouter = new UsersRouterManager().getRouter();

export default usersRouter;