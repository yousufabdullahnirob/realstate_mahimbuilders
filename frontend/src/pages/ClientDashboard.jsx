import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiProxy from "../utils/proxyClient";
import { formatBDT } from "../utils/formatters";

const ClientDashboard = () => {
  const [stats, setStats] = useState({ active_installments: 0, total_paid: 0, upcoming_due: "N/A" });
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : { full_name: "Resident" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, propsRes, booksRes, favsRes, paysRes] = await Promise.allSettled([
          apiProxy.get("/client/stats/"),
          apiProxy.get("/apartments/my/"),
          apiProxy.get("/bookings/my/"),
          apiProxy.get("/favorites/"),
          apiProxy.get("/payments/my/"),
        ]);
        if (statsRes.status === "fulfilled") setStats(statsRes.value);
        if (propsRes.status === "fulfilled") setProperties(Array.isArray(propsRes.value) ? propsRes.value : []);
        if (booksRes.status === "fulfilled") setBookings(Array.isArray(booksRes.value) ? booksRes.value : []);
        if (favsRes.status === "fulfilled") setFavorites(Array.isArray(favsRes.value) ? favsRes.value : []);
        if (paysRes.status === "fulfilled") setPayments(Array.isArray(paysRes.value) ? paysRes.value : []);
      } catch (e) {
        console.error("Dashboard error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dt) => dt ? new Date(dt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" }) : "N/A";

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await apiProxy.post(`/bookings/${bookingId}/cancel/`);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      alert("Booking cancelled.");
    } catch (err) {
      alert("Failed to cancel booking: " + err.message);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <p style={{ color: "#94a3b8", fontWeight: 600 }}>Loading your dashboard...</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", padding: "32px 40px", maxWidth: 1100, margin: "0 auto" }}>

      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: -0.5 }}>
              Welcome back, {user.full_name} 👋
            </h1>
            <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 6 }}>Here is an overview of your account.</p>
          </div>
          <Link to="/apartments" style={{ padding: "10px 20px", background: "#0ea5e9", color: "#fff", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 13 }}>
            Find More Apartments
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Paid", value: formatBDT(stats.total_paid), icon: "💰", color: "#10b981" },
          { label: "Active Installments", value: stats.active_installments, icon: "📋", color: "#0ea5e9" },
          { label: "Upcoming Due", value: formatDate(stats.upcoming_due), icon: "📅", color: "#f59e0b" },
        ].map(card => (
          <div key={card.label} style={{
            background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12,
            padding: "24px 28px", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 16, right: 16, width: 40, height: 40,
              borderRadius: 10, background: card.color + "18",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>{card.icon}</div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{card.label}</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{card.value}</p>
            <div style={{ position: "absolute", bottom: 0, left: 0, height: 3, width: "40%", background: card.color, borderRadius: "0 4px 0 0" }} />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Bookings Section */}
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Booking Status</h2>
          {bookings.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: 14 }}>No bookings yet.</p>
          ) : (
            bookings.map(book => (
              <div key={book.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{book.apartment_title}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8" }}>Ref: {book.booking_reference}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                    background: book.status === "confirmed" ? "#d1fae5" : book.status === "pending" ? "#fef3c7" : "#fee2e2",
                    color: book.status === "confirmed" ? "#065f46" : book.status === "pending" ? "#92400e" : "#991b1b",
                  }}>{book.status}</span>
                  {book.status === 'pending' && (
                    <button 
                      onClick={() => handleCancelBooking(book.id)}
                      style={{ background: 'transparent', border: '1px solid #fee2e2', color: '#991b1b', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Wishlist Section */}
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>My Wishlist</h2>
          {favorites.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: 14 }}>Nothing bookmarked.</p>
          ) : (
            favorites.map(fav => (
              <div key={fav.id} style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 6, background: "#f1f5f9", marginRight: 12, backgroundImage: `url(${fav.apartment_details?.image})`, backgroundSize: "cover" }} />
                <div>
                  <Link to={`/apartments/${fav.apartment}`} style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#0f172a", textDecoration: "none" }}>{fav.apartment_details?.title}</Link>
                  <p style={{ fontSize: 11, color: "#94a3b8" }}>{formatBDT(fav.apartment_details?.price)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payment History */}
      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 28, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Payment History</h2>
          <Link to="/submit-payment" style={{ fontSize: 12, fontWeight: 700, color: "#0ea5e9", textDecoration: "none" }}>
            + Submit Payment
          </Link>
        </div>
        {payments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💳</div>
            <p style={{ fontWeight: 600 }}>No payment history yet</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f1f5f9" }}>
                {["Date", "Amount", "Trx ID", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map(pay => (
                <tr key={pay.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "12px" }}>{formatDate(pay.payment_date)}</td>
                  <td style={{ padding: "12px", fontWeight: 700, color: "#0ea5e9" }}>{formatBDT(pay.amount)}</td>
                  <td style={{ padding: "12px", fontFamily: "monospace", fontSize: 12 }}>{pay.transaction_id}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: "uppercase",
                      background: pay.verification_status === "verified" ? "#d1fae5" : pay.verification_status === "rejected" ? "#fee2e2" : "#fef3c7",
                      color: pay.verification_status === "verified" ? "#065f46" : pay.verification_status === "rejected" ? "#991b1b" : "#92400e",
                    }}>{pay.verification_status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default ClientDashboard;
