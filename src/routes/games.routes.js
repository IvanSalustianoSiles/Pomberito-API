import { GameController } from "../controllers/index.js";
import { CustomRouter, CustomError, errorDictionary } from "../services/index.js";

class GamesRouterManager extends CustomRouter {
    init() {
        this.get("/", ["ADMIN"], async (req, res) => {
            try {
                const games = await GameController.findGames({}, { multi: true });
                if (!games) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, "Partidas");
                req.logger.warning(`El usuario ${req.session.user.email} ha ingresado a una ruta privada. Procura que sea un administrador del sitio. | ::${req.url}`);
                res.sendSuccess(games);
            } catch (error) {
                throw error;
            }
        });
        this.getById("/:gid", ["USER", "ADMIN"], ["gid"], "COMPARE", async (req, res) => {
            try {
                const { gid } = req.params;
                const game = await GameController.findGames({ _id: gid }, { multi: false });
                if (!game) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, `Partida[ID]:${gid}`);
                res.sendSuccess(game);
            } catch (error) {
                throw error;
            }
        });
        this.post("/", ["USER", "ADMIN"], ["gameData"], async (req, res) => {});
        this.put("/", ["ADMIN"], ["filters", "updates"], async (req, res) => {});
        this.putById("/:gid", ["USER", "ADMIN"], ["updatedData"], ["gid"], "COMPARE", async (req, res) => {});
        this.delete("/", ["ADMIN"], ["filters"], async (req, res) => {});
        this.deleteById("/:gid", ["ADMIN"], "NOFIELDS", ["gid"], "NOCOMPARE", async (req, res) => {});
    }
};

const gamesRouter = new GamesRouterManager().getRouter();

export default gamesRouter;