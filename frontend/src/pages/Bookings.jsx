import React, { useState, useEffect } from 'react';
import apiProxy from '../utils/proxyClient';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiProxy.get('/admin/bookings/');
        setBookings(Array.isArray(data) ? data : (data.results || []));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusColor = (s) => {
    if (s === 'confirmed') return 'active';
    if (s === 'cancelled') return 'inactive';
    return 'pending';
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header">
          <h2>Bookings Management</h2>
        </div>
        {loading && <p>Loading bookings...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!loading && !error && (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Apartment</th>
                  <th>Tenant</th>
                  <th>Booked On</th>
                  <th>Advance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center' }}>No bookings found.</td></tr>
                ) : bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.booking_reference}</td>
                    <td>{b.apartment_title || b.apartment}</td>
                    <td>{b.user_email || b.user}</td>
                    <td>{b.booking_date ? new Date(b.booking_date).toLocaleDateString() : '—'}</td>
                    <td>৳{Number(b.advance_amount).toLocaleString()}</td>
                    <td><span className={`status ${statusColor(b.status)}`}>{b.status?.toUpperCase()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
