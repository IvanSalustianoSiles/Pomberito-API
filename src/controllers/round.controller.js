import config from "../config.js";
import { RoundMDBService, CustomError, errorDictionary } from "../services/index.js";

class RoundClass {

    constructor(service) {
        this.service = service;
    };

    findRounds = async (filter, options = { multi: false }) => {
        try {
            const rounds = await this.service.findRounds(filter, options);
            if (!rounds) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, "Mano(s)");
            return rounds;
        } catch (error) {
            throw error;
        }
    };
    createRound = async (roundParams) => {
        try {
            const round = this.service.createRound(roundParams); 
            if (!round) throw new CustomError(errorDictionary.ADD_DATA_ERROR, "Mano");
            return round;
        } catch (error) {
            throw error;
        }
    };
    updateRounds = async (filter, update, options = { multi: false, new: true }) => {
        try {
            const rounds = await this.service.updateRounds(filter, update, options);
            if (!rounds) throw CustomError(errorDictionary.UPDATE_DATA_ERROR, "Mano(s)");
            return rounds;
        } catch (error) {
            throw error;
        }
    };
    deleteRounds = async (filter, options = { multi: false }) => {
        try {
            const rounds = await this.service.deleteRounds(filter, options);
            if (!rounds) throw CustomError(errorDictionary.DELETE_DATA_ERROR, "Mano(s)");
            return rounds;
        } catch (error) {
            throw error;
        }
    };
}

let service;

if (config.DATA_SOURCE === "MDB") { service = RoundMDBService } else { throw CustomError(errorDictionary.NOT_YET_ERROR) };

const RoundController = new RoundClass(service);

export default RoundController;