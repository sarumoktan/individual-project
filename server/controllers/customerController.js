import Customer from '../models/Customer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginCustomer = async (req, res) => {
    const { username, password } = req.body;

    try {
        const customer = await Customer.findOne({ username });
        if (!customer) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await customer.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { customer: { id: customer.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.cookie('token', token, { httpOnly: true }); 
        res.status(200).json({ msg: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

export const registerCustomer = async (req, res) => {
    const { email, username, password, position } = req.body;

    try {
        let customer = await Customer.findOne({ email });
        if (customer) {
            return res.status(400).json({ msg: 'Customer already exists' });
        }

        customer = new Customer({
            email,
            username,
            password,
            position
        });

        await customer.save();
        res.status(201).json({ msg: 'Customer registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

export const logoutCustomer = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ msg: 'Logged out successfully' });
};

export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find(); 
        const customersData = customers.map(customer => {
            const { password, ...customerData } = customer.toObject();
            return customerData;
        });

        res.status(200).json(customersData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
