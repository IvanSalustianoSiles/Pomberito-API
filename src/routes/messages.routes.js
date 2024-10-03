import { MessageController } from "../controllers/index.js";
import { CustomRouter, CustomError, errorDictionary } from "../services/index.js";

class MessagesRouterManager extends CustomRouter {
    init() {
        this.get("/", ["ADMIN"], async (req, res) => {
            try {
                const messages = await MessageController.findMessages({}, { multi: true });
                if (!messages) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, "Mensajes");
                req.logger.warning(`El usuario ${req.session.user.email} ha ingresado a una ruta privada. Procura que sea un administrador del sitio. | ::${req.url}`);
                res.sendSuccess(messages);
            } catch (error) {
                throw error;
            }
        });
        this.getById("/:mid", ["USER", "ADMIN"], ["mid"], "COMPARE", async (req, res) => {
            try {
                const { mid } = req.params;
                const message = await MessageController.findMessages({ _id: mid }, { multi: false });
                if (!message) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, `Mensaje[ID]:${mid}`);
                res.sendSuccess(message);
            } catch (error) {
                throw error;
            }
        });
        this.post("/", ["USER", "ADMIN"], ["message"], async (req, res) => {});
        this.put("/", ["ADMIN"], ["filters", "updates"], async (req, res) => {});
        this.putById("/:mid", ["USER", "ADMIN"], ["updatedMessage"], ["mid"], "COMPARE", async (req, res) => {});
        this.delete("/", ["ADMIN"], ["filters"], async (req, res) => {});
        this.deleteById("/:mid", ["ADMIN", "USER"], "NOFIELDS", ["mid"], "COMPARE", async (req, res) => {});
    }
};

const messagesRouter = new MessagesRouterManager().getRouter();

export default messagesRouter;