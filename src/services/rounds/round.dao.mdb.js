import { roundsModel } from "../../models/index.js"
import { CustomError, errorDictionary } from "../error.handler.js";

class RoundMDBClass {

    constructor(model) {
        this.model = model;
    };

    findRounds = async (filter, options = { multi: false }) => {
        try {
            const rounds = await this.model.find(filter);
            if (!rounds) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, "Mano(s)");
            let round = {};
            if (options.multi == false) { round = rounds[0]; return round }; 
            return rounds;
        } catch (error) {
            throw error;
        }
    };
    createRound = async (roundParams) => {
        try {
            const round = roundParams ? await this.model.create(roundParams) : await this.model.create(); 
            if (!round) throw new CustomError(errorDictionary.ADD_DATA_ERROR, "Mano");
            return round;
        } catch (error) {
            throw error;
        }
    };
    updateRounds = async (filter, update, options = { multi: false, new: true }) => {
        try {
            const updateOptions = options.new == true ? { new: true } : {};
            if (options.multi == true) {
                const updating = await this.model.updateMany(filter, update, updateOptions);
                const rounds = await this.model.find({ ...filter, ...update });
                if (!updating || !rounds) throw CustomError(errorDictionary.UPDATE_DATA_ERROR, "Manos");
                return rounds;
            } else {
                const round = await this.model.findOneAndUpdate(filter, update, updateOptions);
                if (!round) throw new CustomError(errorDictionary.UPDATE_DATA_ERROR, "Mano");
                return round;
            }
        } catch (error) {
            throw error;
        }
    };
    deleteRounds = async (filter, options = { multi: false }) => {
        try {
            if (options.multi == true) {
                const rounds = await this.model.find(filter);
                const deleting = await this.model.deleteMany(filter);
                if (!deleting || !rounds) throw CustomError(errorDictionary.DELETE_DATA_ERROR, "Manos");
                return rounds;
            } else {
                const round = await this.model.findOneAndDelete(filter);
                if (!round) throw new CustomError(errorDictionary.DELETE_DATA_ERROR, "Mano");
                return round;
            }
        } catch (error) {
            throw error;
        }
    };
}

const RoundMDBService = new RoundMDBClass(roundsModel);

export default RoundMDBService;