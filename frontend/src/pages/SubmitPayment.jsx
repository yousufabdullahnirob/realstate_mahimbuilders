import React, { useState } from "react";
import apiProxy from "../utils/proxyClient";
import { useNavigate } from "react-router-dom";

const SubmitPayment = () => {
    const [bookings, setBookings] = useState([]);
    const [formData, setFormData] = useState({
        booking: "",
        amount: "",
        transaction_id: "",
        proof: null
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await apiProxy.get("/bookings/my/");
                setBookings(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, booking: data[0].id }));
                }
            } catch (err) {
                console.error("Failed to fetch bookings:", err);
            }
        };
        fetchBookings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
                // Validate fields
                if (!formData.booking || !formData.amount || !formData.transaction_id || !formData.proof) {
                    alert("All fields are required.");
                    setLoading(false);
                    return;
                }
                const data = new FormData();
                data.append("booking", formData.booking);
                data.append("transaction_id", formData.transaction_id);
                data.append("amount", formData.amount);
                data.append("payment_proof", formData.proof); // Model field is payment_proof
                
                // Using raw fetch for FormData as apiProxy.post stringifies the body
                const token = localStorage.getItem('access');
                const response = await fetch('/api/payments/submit/', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: data
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(JSON.stringify(error));
                }

                alert("Payment proof submitted successfully! Pending verification.");
                navigate("/dashboard");
        } catch (error) {
            console.error("Submission failed:", error);
            alert(`Failed to submit: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '140px', maxWidth: '600px' }}>
            <div className="form-card glass-premium">
                <h2 style={{ color: '#fff' }}>Submit Payment Proof</h2>
                <p style={{ color: '#ffffff88', marginBottom: '20px' }}>Upload your transaction details for verification.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ color: '#fff' }}>Select Booking</label>
                        <select 
                            required 
                            value={formData.booking}
                            onChange={(e) => setFormData({...formData, booking: e.target.value})}
                            style={{ background: '#ffffff11', color: '#fff', border: '1px solid #ffffff22' }}
                        >
                            <option value="" style={{ color: '#000' }}>Choose a booking...</option>
                            {bookings.map(book => (
                                <option key={book.id} value={book.id} style={{ color: '#000' }}>
                                    {book.apartment_title} ({book.booking_reference})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label style={{ color: '#fff' }}>Amount (BDT)</label>
                        <input 
                            type="number" 
                            required 
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ color: '#fff' }}>Transaction ID (TrxID)</label>
                        <input 
                            type="text" 
                            required 
                            value={formData.transaction_id}
                            placeholder="e.g. 7K2B8P9Q"
                            onChange={(e) => setFormData({...formData, transaction_id: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ color: '#fff' }}>Payment Proof (Screenshot or PDF)</label>
                        <input 
                            type="file" 
                            accept="image/*,application/pdf"
                            onChange={(e) => setFormData({...formData, proof: e.target.files[0]})}
                        />
                        <p style={{ fontSize: '11px', color: '#ffffff88', marginTop: '4px' }}>Allowed: JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                    <button type="submit" className="contact-btn" disabled={loading} style={{ width: '100%' }}>
                        {loading ? "Submitting..." : "Submit for Verification"}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard')} style={{ width: '100%', marginTop: '10px', background: 'transparent', border: '1px solid #ffffff33', color: '#fff', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SubmitPayment;
