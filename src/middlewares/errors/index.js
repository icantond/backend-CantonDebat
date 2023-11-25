import EErrors from "./enums.js";

export default (error, req, res, next) => {
    switch (error.code) {
        case EErrors.INVALID_TYPER_ERROR:
            res.status(400).send({
                status: 'error',
                error: error.name,
                description: error.cause
            })
            break;

        case EErrors.ROUTING_ERROR:
            res.status(404).send({
                status: 'error',
                error: error.name,
                description: error.cause
            })
            break;

        case EErrors.USER_NOT_FOUND:
            res.status(404).send({
                status: 'error',
                error: error.name,
                description: error.cause
            })
            break;

        case EErrors.DATABASE_ERROR:
            res.status(500).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;

        default: res.status(500).send({
            status: 'error',
            error: error.name,
            description: error.cause,
        });
            break;

    }
    next();
    
}