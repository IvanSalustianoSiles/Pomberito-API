import { gamesModel } from "../../models/index.js"
import { CustomError, errorDictionary } from "../error.handler.js";

class GameMDBClass {

    constructor(model) {
        this.model = model;
    };

    findGames = async (filter, options = { multi: false }) => {
        try {
            const games = await this.model.find(filter);
            if (!games) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, "Partida(s)");
            let game = {};
            if (options.multi == false) { game = games[0]; return game }; 
            return games;
        } catch (error) {
            throw error;
        }
    };
    createGame = async (gameParams) => {
        try {
            const game = gameParams ? await this.model.create(gameParams) : await this.model.create(); 
            if (!game) throw new CustomError(errorDictionary.ADD_DATA_ERROR, "Partida");
            return game;
        } catch (error) {
            throw error;
        }
    };
    updateGames = async (filter, update, options = { multi: false, new: true }) => {
        try {
            const updateOptions = options.new == true ? { new: true } : {};
            if (options.multi == true) {
                const updating = await this.model.updateMany(filter, update, updateOptions);
                const games = await this.model.find({ ...filter, ...update });
                if (!updating || !games) throw CustomError(errorDictionary.UPDATE_DATA_ERROR, "Partidas");
                return games;
            } else {
                const game = await this.model.findOneAndUpdate(filter, update, updateOptions);
                if (!game) throw new CustomError(errorDictionary.UPDATE_DATA_ERROR, "Partida");
                return game;
            }
        } catch (error) {
            throw error;
        }
    };
    deleteGames = async (filter, options = { multi: false }) => {
        try {
            if (options.multi == true) {
                const games = await this.model.find(filter);
                const deleting = await this.model.deleteMany(filter);
                if (!deleting || !games) throw CustomError(errorDictionary.DELETE_DATA_ERROR, "Partidas");
                return games;
            } else {
                const game = await this.model.findOneAndDelete(filter);
                if (!game) throw new CustomError(errorDictionary.DELETE_DATA_ERROR, "Partida");
                return game;
            }
        } catch (error) {
            throw error;
        }
    };
}

const GameMDBService = new GameMDBClass(gamesModel);

export default GameMDBService;