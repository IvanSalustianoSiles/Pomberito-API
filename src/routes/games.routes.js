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



router.get("/realtimeproducts", (req, res) => {
    toSendObject = ProductManagerFS.readFileAndSave();
    res.render('realTimeProducts', {toSendObject: toSendObject});
  });
  router.post("/realtimeproducts", uploader.single("archivo"), (req, res) => {
    const socketServer = req.app.get("socketServer");  
    const {newProduct, productAction} = JSON.parse(req.body.json); 
    const {id} = newProduct;
    if (productAction == "add") {
      let toAddProduct = {...newProduct, thumbnail: req.file.filename, status: true};
      ProductManagerFS.addProduct(toAddProduct);
      let toAddId = ProductManagerFS.readFileAndSave()[ProductManagerFS.readFileAndSave().length-1]._id;
      socketServer.emit("addConfirmed", {msg: "Producto agregado.", toAddId});
    } else if (productAction == "delete") {
      ProductManagerFS.deleteProductById(id);
      
      socketServer.emit("deleteConfirmed", {msg: `Producto de ID ${id} eliminado.`, pid: id});
    }
    res.render('realTimeProducts', {toSendObject: toSendObject});
  });