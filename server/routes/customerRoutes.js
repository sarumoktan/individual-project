import express from 'express';
import { 
    loginCustomer, 
    registerCustomer, 
    logoutCustomer, 
    getAllCustomers 
} from '../controllers/customerController.js';

const router = express.Router();

router.post('/login', loginCustomer);
router.post('/register', registerCustomer);
router.get('/logout', logoutCustomer);
router.get('/', getAllCustomers);

export default router;
