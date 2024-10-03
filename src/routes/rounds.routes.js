import { RoundController } from "../controllers/index.js";
import { CustomRouter, CustomError, errorDictionary } from "../services/index.js";

class RoundsRouterManager extends CustomRouter {
    init() {
        this.get("/", ["ADMIN"], async (req, res) => {
            try {
                const rounds = await RoundController.findRounds({}, { multi: true });
                if (!rounds) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, "Rondas");
                req.logger.warning(`El usuario ${req.session.user.email} ha ingresado a una ruta privada. Procura que sea un administrador del sitio. | ::${req.url}`);
                res.sendSuccess(rounds);
            } catch (error) {
                throw error;
            }
        });
        this.getById("/:rid", ["USER", "ADMIN"], ["rid"], "COMPARE", async (req, res) => {
            try {
                const { rid } = req.params;
                const round = await RoundController.findRounds({ _id: rid }, { multi: false });
                if (!round) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, `Mano[ID]:${rid}`);
                res.sendSuccess(round);
            } catch (error) {
                throw error;
            }
        });
        this.post("/", ["USER", "ADMIN"], ["roundData"], async (req, res) => {});
        this.put("/", ["ADMIN"], ["filters", "updates"], async (req, res) => {});
        this.putById("/:rid", ["USER", "ADMIN"], ["updatedData"], ["rid"], "COMPARE", async (req, res) => {});
        this.delete("/", ["ADMIN"], ["filters"], async (req, res) => {});
        this.deleteById("/:rid", ["ADMIN"], "NOFIELDS", ["rid"], "NOCOMPARE", async (req, res) => {});
    }
};

const roundsRouter = new RoundsRouterManager().getRouter();

export default roundsRouter;