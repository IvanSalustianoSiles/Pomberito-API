import { GameController } from "../controllers/index.js";
import { CustomRouter, CustomError, errorDictionary } from "../services/index.js";

class GamesRouterManager extends CustomRouter {
    init() {
        this.get("/", ["ADMIN"], async (req, res) => {});
        this.getById("/:gid");
        this.post("/", ["ADMIN"], async (req, res) => {});
        this.postById("/:gid");
        this.put("/", ["ADMIN"], async (req, res) => {});
        this.putById("/:gid");
        this.delete("/", ["ADMIN"], async (req, res) => {});
        this.deleteById("/:gid");
    }
};

const gamesRouter = new GamesRouterManager().getRouter();

export default gamesRouter;