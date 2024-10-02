import { usersModel } from "../../models/index.js"
import { CustomError, errorDictionary } from "../error.handler.js";

class UserMDBClass {

    constructor(model) {
        this.model = model;
    };

    findUsers = async (filter, options = { multi: false }) => {
        try {
            const users = await this.model.find(filter);
            if (!users) throw new CustomError(errorDictionary.FOUND_USER_ERROR);
            let user = {};
            if (options.multi == true) { user = users[0]; return user }; 
            return users;
        } catch (error) {
            throw error;
        }
    };
    createUser = async (userParams) => {
        try {
            const user = userParams ? await this.model.create(userParams) : await this.model.create(); 
            if (!user) throw new CustomError(errorDictionary.ADD_DATA_ERROR, "Usuario");
            return user;
        } catch (error) {
            throw error;
        }
    };
    updateUsers = async (filter, update, options = { multi: false, new: true }) => {
        try {
            const updateOptions = options.new == true ? { new: true } : {};
            if (options.multi == true) {
                const updating = await this.model.updateMany(filter, update, updateOptions);
                const users = await this.model.find({ ...filter, ...update });
                if (!updating || !users) throw CustomError(errorDictionary.UPDATE_DATA_ERROR, "Usuarios");
                return users;
            } else {
                const user = await this.model.findOneAndUpdate(filter, update, updateOptions);
                if (!user) throw new CustomError(errorDictionary.UPDATE_DATA_ERROR, "Usuario");
                return user;
            }
        } catch (error) {
            throw error;
        }
    };
    deleteUsers = async (filter, options = { multi: false }) => {
        try {
            if (options.multi == true) {
                const users = await this.model.find(filter);
                const deleting = await this.model.deleteMany(filter);
                if (!deleting || !users) throw CustomError(errorDictionary.DELETE_DATA_ERROR, "Usuarios");
                return users;
            } else {
                const user = await this.model.findOneAndDelete(filter);
                if (!user) throw new CustomError(errorDictionary.DELETE_DATA_ERROR, "Usuario");
                return user;
            }
        } catch (error) {
            throw error;
        }
    };
}

const UserMDBService = new UserMDBClass(usersModel);

export default UserMDBService;