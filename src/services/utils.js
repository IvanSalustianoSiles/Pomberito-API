import bcrypt from "bcrypt";

// Middlewares

export const generateCustomResponses = async (req, res, next) => {
    res.sendSuccess = (payload) =>
      res
        .status(200)
        .send({ 
            origin: config.SERVER, 
            status: 200, 
            payload: payload 
        }); 
    res.sendBadRequestError = (error, message) =>
        res.status(400)
        .send({ 
          origin: config.SERVER, 
          error: `[ERROR[400]::CODE[${error.code}]: ${error.message || message || "NO_WARNING"}` + ` (${message || "NO_SPECIFIC_WARNING"})` 
        });
    res.sendServerError = (error, message) =>
      res
        .status(500)
        .send({
          origin: config.SERVER,
          status: 500,
          error: `[ERROR[500]::CODE[${error.code}]: ${error.message || message || "NO_WARNING"}` + ` (${message || "NO_SPECIFIC_WARNING"})` 
        });
    res.sendUnavailableError = (error, message) =>
      res
        .status(501)
        .send({
          origin: config.SERVER,
          status: 501,
          error: `[ERROR[501]::CODE[${error.code}]: ${error.message || message || "NO_WARNING"}` + ` (${message || "NO_SPECIFIC_WARNING"})`
        });
    res.sendAuthenError = (error, message) =>
      res
        .status(401)
        .send({
          origin: config.SERVER,
          status: 401,
          error: `[ERROR[401]::CODE[${error.code}]: ${error.message || message || "NO_WARNING"}` + ` (${message || "NO_SPECIFIC_WARNING"})` 
        });
    res.sendAuthorError = (error, message) =>
      res
        .status(403)
        .send({
          origin: config.SERVER,
          status: 403,
          error: `[ERROR[403]::CODE[${error.code}]: ${error.message || message || "NO_WARNING"}` + ` (${message || "NO_SPECIFIC_WARNING"})` 
        });
    res.sendNotFoundError = (error, message) =>
      res
        .status(404)
        .send({
          origin: config.SERVER,
          status: 404,
          error: `[ERROR[404]::CODE[${error.code}]: ${error.message || message || "NO_WARNING"}` + ` (${message || "NO_SPECIFIC_WARNING"})` 
        });
    next();
};

// No Middlewares

export const createHash = (password) => {
  try {
    const validation = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    if (!validation) throw new CustomError(errorDictionary.GENERATE_DATA_ERROR, "Contraseña");
    return validation;
  } catch (error) {
    return undefined; 
  }
};
export const isValidPassword = (user, password) => { 
  try {    
    const compare = bcrypt.compareSync(password, user.password);
    if (!compare) throw new CustomError(errorDictionary.AUTHORIZE_PASS_ERROR);
    return compare;
  } catch (error) {
    return undefined;
  }
};