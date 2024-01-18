import { Router } from 'express';
import * as UsersController from '../controllers/users.controller.js';
// import { documentsUpload } from '../utils.js';
import { authMiddleware } from '../middlewares/auth/auth.middlewares.js';
import { uploadDocuments, uploadProfile } from '../utils.js';

const router = Router();

router.put('/premium/:uid', authMiddleware, UsersController.changeUserRole);
router.post('/:uid/documents', uploadDocuments.array('documents'), UsersController.uploadDocuments);
router.post('/:uid/profile', uploadProfile.single('profile'), UsersController.uploadProfile);

export default router;  