import { messagesModel } from "../../models/index.js"
import { CustomError, errorDictionary } from "../error.handler.js";

class MessageMDBClass {

    constructor(model) {
        this.model = model;
    };

    findMessages = async (filter, options = { multi: false }) => {
        try {
            const messages = await this.model.find(filter);
            if (!messages) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, "Mensaje(s)");
            let message = {};
            if (options.multi == false) { message = messages[0]; return message }; 
            return messages;
        } catch (error) {
            throw error;
        }
    };
    createMessage = async (messageParams) => {
        try {
            const message = messageParams ? await this.model.create(messageParams) : await this.model.create(); 
            if (!message) throw new CustomError(errorDictionary.ADD_DATA_ERROR, "Mensaje");
            return message;
        } catch (error) {
            throw error;
        }
    };
    updateMessages = async (filter, update, options = { multi: false, new: true }) => {
        try {
            const updateOptions = options.new == true ? { new: true } : {};
            if (options.multi == true) {
                const updating = await this.model.updateMany(filter, update, updateOptions);
                const messages = await this.model.find({ ...filter, ...update });
                if (!updating || !messages) throw CustomError(errorDictionary.UPDATE_DATA_ERROR, "Mensajes");
                return messages;
            } else {
                const message = await this.model.findOneAndUpdate(filter, update, updateOptions);
                if (!message) throw new CustomError(errorDictionary.UPDATE_DATA_ERROR, "Mensaje");
                return message;
            }
        } catch (error) {
            throw error;
        }
    };
    deleteMessages = async (filter, options = { multi: false }) => {
        try {
            if (options.multi == true) {
                const messages = await this.model.find(filter);
                const deleting = await this.model.deleteMany(filter);
                if (!deleting || !messages) throw CustomError(errorDictionary.DELETE_DATA_ERROR, "Mensajes");
                return messages;
            } else {
                const message = await this.model.findOneAndDelete(filter);
                if (!message) throw new CustomError(errorDictionary.DELETE_DATA_ERROR, "Mensaje");
                return message;
            }
        } catch (error) {
            throw error;
        }
    };
}

const MessageMDBService = new MessageMDBClass(messagesModel);

export default MessageMDBService;