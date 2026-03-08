import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

/*
    common error response type: 
    {
        errors: [{
            message: string,
            field? : string
        }]    
    }[]
*/

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    
    if( err instanceof RequestValidationError) {
        const formattedErrors = err.errors.map((error) => {
            console.log("I am error", error);
            return {
                message: error.msg,
                field: (error as any).param || (error as any).path || 'unknown'
            }
        })
        return res.status(400).send({ errors: formattedErrors });
    }

    if (err instanceof DatabaseConnectionError) {
        return res.status(500).send( { errors: [{ message: err.reason }] } );
    }
    //  If there is a generic error, it should follow the same structure which we are following earlier. 
    res.status(400).send({
        errors: [
            {
                message: 'Something went wrong'
            }
        ]
    });
}