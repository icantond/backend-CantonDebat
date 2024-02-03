import EErrors from './enums.js';

export default (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    switch (error.code) {
        case EErrors.INVALID_TYPER_ERROR:
            res.status(400).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;

        case 'ValidationError':
            res.status(400).send({
                status: 'error',
                error: 'ValidationError',
                description: 'Validation error',
                validationErrors: error.validationErrors,
            });
            break;

        case 'UserRolesError':
            res.status(403).send({
                status: 'error',
                error: 'UserRolesError',
                description: 'User roles error',
                userRoles: error.userRoles,
            });
            break;

        case EErrors.DATABASE_ERROR:
            res.status(500).send({
                status: 'error',
                error: 'DatabaseError',
                description: 'Database error',
            });
            break;

        default:
            res.status(500).send({
                status: 'error',
                error: error.name,
                description: error.cause,
            });
            break;
    }
    next();
};
