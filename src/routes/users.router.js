import { Router } from 'express';
import * as UsersController from '../controllers/users.controller.js';
import { adminAccess, authMiddleware } from '../middlewares/auth/auth.middlewares.js';
import { uploadDocuments, uploadProfile } from '../utils.js';

const router = Router();

router.put('/premium/:uid', authMiddleware, UsersController.changeUserRole);
router.post('/:uid/documents', uploadDocuments.array('documents'), UsersController.uploadDocuments);
router.post('/:uid/profile', uploadProfile.single('profile'), UsersController.uploadProfile);

router.get('/', adminAccess, UsersController.getAllUsers);
router.delete('/', adminAccess, UsersController.deleteInactiveUsers);

export default router;  