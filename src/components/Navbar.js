import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useContext(AuthContext);

    return (
        <nav style={{ padding: '1rem', background: '#003580', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>✈️ AeroStream</Link>
            <div>
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" style={{ margin: '0 10px', color: 'white' }}>Login</Link>
                        <Link to="/signup" style={{ margin: '0 10px', color: 'white' }}>Signup</Link>
                    </>
                ) : (
                    <>
                        <span style={{ marginRight: '10px' }}>Hello, {user?.email}</span>
                        <button onClick={logout} style={{ background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;