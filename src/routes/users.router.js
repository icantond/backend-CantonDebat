import { Router } from 'express';
import * as UsersController from '../controllers/users.controller.js';
import { upload } from '../utils.js';
import { authMiddleware, adminAccess, publicAccess } from '../middlewares/auth/auth.middlewares.js';

const router = Router();

router.put('/premium/:uid', authMiddleware, UsersController.changeUserRole);
router.post('/:uid/documents', upload.array('documents'), UsersController.uploadDocuments);

export default router;  