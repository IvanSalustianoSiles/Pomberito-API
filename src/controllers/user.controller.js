import config from "../config.js";
import { UserMDBService, CustomError, errorDictionary } from "../services/index.js";

class UserClass {

    constructor(service) {
        this.service = service;
    };

    findUsers = async (filter, options = { multi: false }) => {
        try {
            const users = await this.service.findUsers(filter, options);
            if (!users) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, "Usuario(s)");
            return users;
        } catch (error) {
            throw error;
        }
    };
    createUser = async (userParams) => {
        try {
            const user = this.service.createUser(userParams); 
            if (!user) throw new CustomError(errorDictionary.ADD_DATA_ERROR, "Usuario");
            return user;
        } catch (error) {
            throw error;
        }
    };
    updateUsers = async (filter, update, options = { multi: false, new: true }) => {
        try {
            const users = await this.service.updateUsers(filter, update, options);
            if (!users) throw CustomError(errorDictionary.UPDATE_DATA_ERROR, "Usuario(s)");
            return users;
        } catch (error) {
            throw error;
        }
    };
    deleteUsers = async (filter, options = { multi: false }) => {
        try {
            const users = await this.service.deleteUsers(filter, options);
            if (!users) throw CustomError(errorDictionary.DELETE_DATA_ERROR, "Usuario(s)");
            return users;
        } catch (error) {
            throw error;
        }
    };
}

let service;

if (config.DATA_SOURCE === "MDB") { service = UserMDBService } else { throw CustomError(errorDictionary.NOT_YET_ERROR) };

const UserController = new UserClass(service);

export default UserController;