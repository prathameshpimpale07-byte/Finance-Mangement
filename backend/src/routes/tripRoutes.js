import { Router } from 'express';
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from '../controllers/tripController.js';

const router = Router();

router.route('/').post(createTrip).get(getTrips);
router.route('/:id').get(getTripById).put(updateTrip).delete(deleteTrip);

export default router;

