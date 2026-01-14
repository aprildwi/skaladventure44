// pages/Profile.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiLogOut } from 'react-icons/fi';

function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="not-logged-in">
            <h2>Please login to view profile</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={user.avatar} alt={user.name} />
            <div className="avatar-badge">
              {user.role === 'admin' ? '👑' : '👤'}
            </div>
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p className="profile-role">
              {user.role === 'admin' ? 'Administrator' : 'Adventure Member'}
            </p>
            <p className="profile-member">Member since 2024</p>
          </div>
          <div className="profile-actions">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-outline"
            >
              <FiEdit2 /> {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button 
              onClick={logout}
              className="btn btn-secondary"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="profile-details">
              <div className="detail-item">
                <FiUser />
                <div>
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="profile-input"
                    />
                  ) : (
                    <p>{user.name}</p>
                  )}
                </div>
              </div>

              <div className="detail-item">
                <FiMail />
                <div>
                  <label>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="profile-input"
                    />
                  ) : (
                    <p>{user.email}</p>
                  )}
                </div>
              </div>

              <div className="detail-item">
                <FiPhone />
                <div>
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="profile-input"
                    />
                  ) : (
                    <p>{user.phone}</p>
                  )}
                </div>
              </div>

              <div className="detail-item">
                <FiMapPin />
                <div>
                  <label>Address</label>
                  {isEditing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="profile-input"
                      rows="3"
                    />
                  ) : (
                    <p>{user.address}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="profile-edit-actions">
                <button onClick={handleSave} className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {user.role === 'user' && (
            <div className="profile-section">
              <h2>My Activity</h2>
              <div className="activity-stats">
                <div className="stat-card">
                  <div className="stat-number">5</div>
                  <div className="stat-label">Orders</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">3</div>
                  <div className="stat-label">Wishlist Items</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">Rp 8.450.000</div>
                  <div className="stat-label">Total Spent</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;