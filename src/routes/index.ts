import { Router } from "express";
import authRouter from './api/authRoute';
import profileRouter from './api/profileRoute';
import recordingRouter from './api/recordingRoute';

const apiRouter = Router();

apiRouter.use('/api/auth', authRouter);
apiRouter.use('/api/profile', profileRouter);
apiRouter.use('/api/recording', recordingRouter);

export default apiRouter;