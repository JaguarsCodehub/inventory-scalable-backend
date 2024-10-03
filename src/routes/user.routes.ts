import { Request, Response, Router } from 'express';
// import { getAllUsers } from '../controllers/user.controller';
import db from '../utils/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await db.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
})


export default router;
