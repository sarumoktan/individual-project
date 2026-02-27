import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthInput from '../input/AuthInput';
import AuthInputIcon from '../input/AuthInputIcon';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AuthForm({ authMethod }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(
        authMethod === 'register'
            ? { username: '', email: '', password: '', repeat_password: '' }
            : { username: '', password: '' }
    );

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [errors, setErrors] = useState({});
    
    useEffect(() => {
        if (authMethod === 'register') {
            setFormData({ username: '', email: '', password: '', repeat_password: '' });
        } else {
            setFormData({ username: '', password: '' });
        }
    }, [authMethod]);

    const inputDataChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let formErrors = {};

        if (!formData.username.trim()) {
            formErrors.username = 'Username is required';
        }
        if (!formData.password) {
            formErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            formErrors.password = 'Password must be at least 6 characters';
        }

        if (authMethod === 'register') {
            if (!formData.email.trim()) {
                formErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                formErrors.email = 'Invalid email format';
            }

            if (!formData.repeat_password) {
                formErrors.repeat_password = 'Confirm password is required';
            } else if (formData.password !== formData.repeat_password) {
                formErrors.repeat_password = 'Passwords do not match';
            }
        }

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            let response;
            if (authMethod === 'register') {
                response = await axios.post(`${API_BASE_URL}/api/customer/register`, formData);
                toast.success('Registration successful! Redirecting to login...', { position: 'top-right' });
                setTimeout(() => navigate('/bus-booking/login'), 2000); 
            } else {
                response = await axios.post(`${API_BASE_URL}/api/customer/login`, {
                    username: formData.username,
                    password: formData.password,
                });

                localStorage.setItem('token', response.data.token);
                
                toast.success('Login successful! Redirecting...', { position: 'top-right' });
                setTimeout(() => navigate('/bus-booking/dashboard'), 2000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong!', { position: 'top-right' });
        }
    };

    return (
        <main className="flex-1 flex items-center justify-center p-4  ">
            <div className="rounded-2xl p-8 w-full max-w-md border-2">
                {authMethod === 'register' ? (
                    <h1 className="text-3xl font-semibold mb-8  text-center">
                        Create your QTechy Account
                    </h1>
                ) : (
                    <div className="flex justify-start items-start flex-col">
                        <h1 className="text-3xl font-bold mb-2">Sign in</h1>
                        <p className="text-gray-600 mb-6">Enter your QTechy Account details.</p>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <AuthInput
                        id="username"
                        name="username"
                        label="Username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={inputDataChange}
                        error={errors.username}
                    />

                    {authMethod === 'register' && (
                        <AuthInput
                            id="email"
                            name="email"
                            label="Email"
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={inputDataChange}
                            error={errors.email}
                        />
                    )}

                    <AuthInputIcon
                        id="password"
                        name="password"
                        label="Password"
                        placeholder="********"
                        value={formData.password}
                        onChange={inputDataChange}
                        error={errors.password}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />

                    {authMethod === 'register' && (
                        <AuthInputIcon
                            id="repeat_password"
                            name="repeat_password"
                            label="Repeat Password"
                            placeholder="********"
                            value={formData.repeat_password}
                            onChange={inputDataChange}
                            error={errors.repeat_password}
                            showPassword={showRepeatPassword}
                            setShowPassword={setShowRepeatPassword}
                        />
                    )}

                    {!authMethod === 'register' && (
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="keep-signed"
                                className="h-4 w-4 text-[#6d4aff] focus:ring-[#6d4aff] border-gray-300 rounded"
                            />
                            <div className="ml-2">
                                <label htmlFor="keep-signed" className="text-sm text-gray-700">
                                    Keep me signed in
                                </label>
                                <p className="text-xs text-gray-500">
                                    Recommended on trusted devices.{' '}
                                    <a href="#" className="text-[#6d4aff] hover:underline">
                                        Why?
                                    </a>
                                </p>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#6d4aff] text-white py-3 rounded-lg hover:bg-[#5b3df5] transition-colors"
                    >
                        {authMethod === 'register' ? 'Create account' : 'Sign in'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    {authMethod === 'register' ? (
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/bus-booking/login" className="text-[#6d4aff] hover:underline">
                                Sign in
                            </Link>
                        </p>
                    ) : (
                        <p className="text-sm text-gray-600">
                            New to QTechy?{' '}
                            <Link to="/bus-booking/register" className="text-[#6d4aff] hover:underline">
                                Create account
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}

export default AuthForm;
