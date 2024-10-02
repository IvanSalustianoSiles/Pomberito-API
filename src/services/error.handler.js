export const errorDictionary = {
    UNHANDLED_ERROR: { code: 0, status: 500, message: "Error no identificado." },
    AUTHENTICATE_USER_ERROR: { code: 1, status: 401, message: "Usuario no autenticado; acceso denegado." },
    AUTHENTICATE_ID_ERROR: { code: 2, status: 401, message: "ID no ingresada; acceso denegado." },
    AUTHORIZE_USER_ERROR: { code: 3, status: 403, message: "Usuario no autorizado." },
    AUTHORIZE_ID_ERROR: { code: 4, status: 403, message: "ID no permitida; acceso denegado." },
    INVALID_ID_ERROR: { code: 5, status: 403, message: "ID inválida." },
    FOUND_ID_ERROR: { code: 6, status: 404, message: "ID no encontrada." },
    FOUND_USER_ERROR: { code: 7, status: 404, message: "Usuario no encontrado." },
    GENERAL_FOUND_ERROR: { code: 8, status: 404, message: "Data no encontrada." },
    SESSION_ERROR: { code: 9, status: 500, message: "Error de sesión." },
    NOT_YET_ERROR: { code: 10, status: 501, message: "Experiencia de usuario aún no implementada." },
    FEW_PARAMS_ERROR: { code: 11, status: 400, message: "Ingrese los demás campos." },
    GENERATE_DATA_ERROR: { code: 12, status: 400, message: "Error al general la información." },
    AUTHORIZE_PASS_ERROR: { code: 13, status: 403, message: "Contraseña inválida; acceso denegado." },
    UPDATE_DATA_ERROR: { code: 14, status: 400, message: "Error al actualizar la información." },
    DELETE_DATA_ERROR: { code: 15, status: 400, message: "Error al eliminar la información." },
    ADD_DATA_ERROR: { code: 16, status: 400, message: "Error al agregar la información." }
};

export class CustomError extends Error { 
    constructor(type, message = '') {
        super(message); 
        this.type = type;
    };
};

const errorHandler = (error, req, res, next) => {
    let customError = errorDictionary[0]; 
    for (const key in errorDictionary) {
        if (errorDictionary[key].code === error.type.code) customError = errorDictionary[key];
    };
    req.logger.error(`[ERROR[${customError.status}]::CODE[${customError.code}]: ${customError.message || error.message || "NO_WARNING"}` + ` (${error.message || "NO_SPECIFIC_WARNING"}) | ::[${req.url || "UNKNOWN_LOCATION"}]`);
    
    switch (customError.status) {
        case 400:
            res.sendBadRequestError(customError, error.message);
        break;
        case 401:
            res.sendAuthenError(customError, error.message);
        break;
        case 403:
            res.sendAuthorError(customError, error.message);
        break;
        case 404:
            res.sendNotFoundError(customError, error.message);
        break;
        case 500:
            res.sendServerError(customError, error.message);
        break;
        case 501:
            res.sendUnavailableError(customError, error.message);
        break;
    }
    next();
};

export default errorHandler;