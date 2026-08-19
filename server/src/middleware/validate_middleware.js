const {ValidationError}=require("../errors/AppError")
const validate = (schema, requestType = "body") => {

    return (req, res, next) => {

        try {

            req[requestType] = schema.parse(req[requestType]);

            next();

        } catch (err) {

            throw new ValidationError(err);

        }

    };

};
module.exports = validate;