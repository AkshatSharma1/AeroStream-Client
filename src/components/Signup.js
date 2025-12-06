import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/user/signup', { email, password });
            alert('Signup Successful! Please login.');
            navigate('/login');
        } catch (error) {
            alert('Signup Failed');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ display: 'block', margin: '10px 0' }} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ display: 'block', margin: '10px 0' }} />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;