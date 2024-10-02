import config from "../config.js";
import { GameMDBService, CustomError, errorDictionary } from "../services/index.js";

class GameClass {

    constructor(service) {
        this.service = service;
    };

    findGames = async (filter, options = { multi: false }) => {
        try {
            const games = await this.service.findGames(filter, options);
            if (!games) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, "Partida(s)");
            return games;
        } catch (error) {
            throw error;
        }
    };
    createGame = async (gameParams) => {
        try {
            const game = this.service.createGame(gameParams); 
            if (!game) throw new CustomError(errorDictionary.ADD_DATA_ERROR, "Partida");
            return game;
        } catch (error) {
            throw error;
        }
    };
    updateGames = async (filter, update, options = { multi: false, new: true }) => {
        try {
            const games = await this.service.updateGames(filter, update, options);
            if (!games) throw CustomError(errorDictionary.UPDATE_DATA_ERROR, "Partida(s)");
            return games;
        } catch (error) {
            throw error;
        }
    };
    deleteGames = async (filter, options = { multi: false }) => {
        try {
            const games = await this.service.deleteGames(filter, options);
            if (!games) throw CustomError(errorDictionary.DELETE_DATA_ERROR, "Partida(s)");
            return games;
        } catch (error) {
            throw error;
        }
    };
}

let service;

if (config.DATA_SOURCE === "MDB") { service = GameMDBService } else { throw CustomError(errorDictionary.NOT_YET_ERROR) };

const GameController = new GameClass(service);

export default GameController;