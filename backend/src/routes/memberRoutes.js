import { Router } from 'express';
import {
  addMember,
  getMembers,
  removeMember,
} from '../controllers/memberController.js';

const router = Router();

router.route('/:tripId').post(addMember).get(getMembers);
router.route('/:tripId/:memberId').delete(removeMember);

export default router;

