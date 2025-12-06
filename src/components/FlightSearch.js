import React, { useState, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const FlightSearch = () => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [flights, setFlights] = useState([]);
    const [searchMode, setSearchMode] = useState('normal'); 
    
    // UPDATED STATE: Added tripDate and travellers
    const [formData, setFormData] = useState({ 
        from: '', 
        to: '', 
        tripDate: '', 
        travellers: 1 
    });
    
    const [aiQuery, setAiQuery] = useState('');

    const searchFlights = async (params) => {
        try {
            // 1. Map Frontend Form Data to Backend Query Params
            const queryParams = {};
            
            if(params.from) queryParams.departureAirportId = params.from.toUpperCase(); // Ensure UpperCase (e.g., DEL)
            if(params.to) queryParams.arrivalAirportId = params.to.toUpperCase();
            
            // Matches 'query.travellers' in flight-service.js
            if(params.travellers) queryParams.travellers = params.travellers; 
            
            // Matches 'query.tripDate' in flight-service.js
            if(params.tripDate) queryParams.tripDate = params.tripDate; 

            const res = await api.get('/flights', { params: queryParams });
            setFlights(res.data.data);
        } catch (error) {
            console.error(error);
            alert("Error fetching flights");
        }
    };

    const handleNormalSearch = (e) => {
        e.preventDefault();
        searchFlights(formData);
    };

    const handleAiSearch = (e) => {
        e.preventDefault();
        // 🤖 SIMULATED AI PARSER (Until you have a backend AI Search endpoint)
        // Parses: "Flights from DEL to BOM for 2 people on 2024-12-25"
        const words = aiQuery.toUpperCase().split(' ');
        
        const params = { travellers: 1 }; // Default
        
        const fromIndex = words.indexOf('FROM');
        const toIndex = words.indexOf('TO');
        const forIndex = words.indexOf('FOR');
        
        if(fromIndex !== -1 && words[fromIndex + 1]) params.from = words[fromIndex + 1];
        if(toIndex !== -1 && words[toIndex + 1]) params.to = words[toIndex + 1];
        
        // Simple logic to grab number after 'FOR' (e.g., "FOR 3")
        if(forIndex !== -1 && words[forIndex + 1] && !isNaN(words[forIndex + 1])) {
            params.travellers = words[forIndex + 1];
        }

        // Try to find a date (Simple regex for YYYY-MM-DD)
        const dateMatch = aiQuery.match(/\d{4}-\d{2}-\d{2}/);
        if(dateMatch) params.tripDate = dateMatch[0];

        if(!params.from || !params.to) {
            alert("AI couldn't understand. Try 'Flights from DEL to BOM for 2'");
            return;
        }
        searchFlights(params);
    };

    const handleBook = async (flightId, price) => {
        if(!isAuthenticated) return alert("Please Login to Book");

        // CHECK: Don't allow booking if requested seats > available seats
        // We use the travellers count from the search form
        const seatsRequested = formData.travellers;

        try {
            const idempotencyKey = uuidv4(); 

            await api.post('/bookings', {
                flightId: flightId,
                userId: user.id,
                noOfSeats: seatsRequested, // <--- Send the actual count
                totalCost: price * seatsRequested // <--- Calculate total price
            }, {
                headers: {
                    'x-idempotency-key': idempotencyKey
                }
            });
            alert(`✅ Booking Successful for ${seatsRequested} passengers! Check your email.`);
        } catch (error) {
            alert("Booking Failed: " + (error.response?.data?.message || "Unknown error"));
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button 
                    onClick={() => setSearchMode('normal')} 
                    style={{ padding: '10px', flex: 1, background: searchMode === 'normal' ? '#003580' : '#ddd', color: searchMode === 'normal' ? 'white' : 'black', border: 'none' }}
                >
                    Normal Search
                </button>
                <button 
                    onClick={() => setSearchMode('ai')} 
                    style={{ padding: '10px', flex: 1, background: searchMode === 'ai' ? '#7B2CBF' : '#ddd', color: searchMode === 'ai' ? 'white' : 'black', border: 'none' }}
                >
                    ✨ AI Search
                </button>
            </div>

            {searchMode === 'normal' ? (
                <form onSubmit={handleNormalSearch} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', background: '#f9f9f9' }}>
                    <h3>Find Flights</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        <div>
                            <label>From</label>
                            <input 
                                placeholder="DEL" 
                                value={formData.from}
                                onChange={e => setFormData({...formData, from: e.target.value})} 
                                style={{ width: '100%', padding: '8px' }}
                                required
                            />
                        </div>
                        <div>
                            <label>To</label>
                            <input 
                                placeholder="BOM" 
                                value={formData.to}
                                onChange={e => setFormData({...formData, to: e.target.value})} 
                                style={{ width: '100%', padding: '8px' }}
                                required
                            />
                        </div>
                        <div>
                            <label>Date</label>
                            <input 
                                type="date" 
                                value={formData.tripDate}
                                onChange={e => setFormData({...formData, tripDate: e.target.value})} 
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div>
                            <label>Travellers</label>
                            <input 
                                type="number" 
                                min="1" 
                                value={formData.travellers}
                                onChange={e => setFormData({...formData, travellers: parseInt(e.target.value)})} 
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                    </div>
                    <button type="submit" style={{ background: '#007BFF', color: 'white', padding: '10px 20px', border: 'none', width: '100%' }}>Search Flights</button>
                </form>
            ) : (
                <form onSubmit={handleAiSearch} style={{ border: '1px solid #7B2CBF', padding: '20px', borderRadius: '8px', background: '#F3E5F5' }}>
                    <h3>✨ AI Assistant</h3>
                    <p style={{ fontSize: '0.9rem', color: '#555' }}>Try: <i>"Flights from DEL to BOM for 2 people on 2024-12-25"</i></p>
                    <input 
                        placeholder="Describe your trip..." 
                        style={{ width: '100%', padding: '12px', marginBottom: '10px' }}
                        onChange={e => setAiQuery(e.target.value)}
                    />
                    <button type="submit" style={{ background: '#7B2CBF', color: 'white', padding: '10px 20px', border: 'none', width: '100%' }}>Ask AI</button>
                </form>
            )}

            <div style={{ marginTop: '30px' }}>
                <h3>Available Flights ({flights.length})</h3>
                {flights.length === 0 && <p style={{color: '#888'}}>No flights found. Try changing filters.</p>}
                
                {flights.map(flight => (
                    <div key={flight.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ margin: '0 0 5px 0' }}>{flight.flightNumber}</h4>
                            <div style={{ color: '#555' }}>
                                <span>🛫 {flight.departureAirportId} ({new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})</span>
                                <span style={{ margin: '0 10px' }}>➝</span>
                                <span>🛬 {flight.arrivalAirportId} ({new Date(flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})</span>
                            </div>
                            <small style={{ color: 'green' }}>{flight.totalSeats} seats remaining</small>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>₹{flight.price}</h3>
                            <button 
                                onClick={() => handleBook(flight.id, flight.price)}
                                style={{ background: '#007BFF', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Book
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlightSearch;