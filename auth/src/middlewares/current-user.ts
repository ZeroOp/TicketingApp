import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
interface UserPayload {
    id: string;
    email: string;
}
// we are adding optional chaining here because if we have the req object but it does not have the session property or if it has the session property but it does not have the jwt property,
// then we will return null as the currentUser.

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}
// if the current user is not logged in we will move on , but if the user is logged in then we will add the currentUser to Request object and then we can use it in the routes.
// we can resuse this middle ware in other services we create as well. 
export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    if(!req || !req.session  || !req.session.jwt){
        return next();
    }
    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payload;
    } catch(err) {}

    next();
}