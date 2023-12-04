import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import routes from './app/modules/User/user.routes';
import httpStatus from 'http-status';

const app: Application = express();

app.use(cors())



//parse
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//application
app.use("/api/v1/", routes)


app.use((req: Request, res:Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API not found'
            }
        ]
    });
    next()
})

export default app;