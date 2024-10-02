import config from "../config.js";
import { MessageMDBService, CustomError, errorDictionary } from "../services/index.js";

class MessageClass {

    constructor(service) {
        this.service = service;
    };

    findMessages = async (filter, options = { multi: false }) => {
        try {
            const messages = await this.service.findMessages(filter, options);
            if (!messages) throw new CustomError(errorDictionary.GENERAL_FOUND_ERROR, "Mensaje(s)");
            return messages;
        } catch (error) {
            throw error;
        }
    };
    createMessage = async (messageParams) => {
        try {
            const message = this.service.createMessage(messageParams); 
            if (!message) throw new CustomError(errorDictionary.ADD_DATA_ERROR, "Mensaje");
            return message;
        } catch (error) {
            throw error;
        }
    };
    updateMessages = async (filter, update, options = { multi: false, new: true }) => {
        try {
            const messages = await this.service.updateMessages(filter, update, options);
            if (!messages) throw CustomError(errorDictionary.UPDATE_DATA_ERROR, "Mensaje(s)");
            return messages;
        } catch (error) {
            throw error;
        }
    };
    deleteMessages = async (filter, options = { multi: false }) => {
        try {
            const messages = await this.service.deleteMessages(filter, options);
            if (!messages) throw CustomError(errorDictionary.DELETE_DATA_ERROR, "Mensaje(s)");
            return messages;
        } catch (error) {
            throw error;
        }
    };
}

let service;

if (config.DATA_SOURCE === "MDB") { service = MessageMDBService } else { throw CustomError(errorDictionary.NOT_YET_ERROR) };

const MessageController = new MessageClass(service);

export default MessageController;