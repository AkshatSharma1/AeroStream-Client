import React, { useState, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/user/signin', { email, password });
            if(res.data.success) {
                login(res.data.data); // 'data' is the token string
                navigate('/');
            }
        } catch (error) {
            alert('Login Failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ display: 'block', margin: '10px 0' }} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ display: 'block', margin: '10px 0' }} />
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default Login;