import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  Globe,
  Award,
  Activity,
  Sprout,
  Package,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: {
      state: '',
      district: '',
      village: ''
    },
    profile: {
      bio: '',
      experience: '',
      specialization: [],
      farmSize: '',
      cropTypes: []
    },
    preferences: {
      language: 'en',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  });
  const [userActivity, setUserActivity] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || { state: '', district: '', village: '' },
        profile: user.profile || { bio: '', experience: '', specialization: [], farmSize: '', cropTypes: [] },
        preferences: user.preferences || { language: 'en', notifications: { email: true, sms: false, push: true } }
      });
      fetchUserActivity();
    }
  }, [user]);

  const fetchUserActivity = async () => {
    try {
      const response = await axios.get(`/api/users/${user._id}/activity`);
      setUserActivity(response.data);
    } catch (error) {
      console.error('Failed to fetch user activity:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayInputChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: array
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'farmer': return 'bg-green-100 text-green-800';
      case 'seller': return 'bg-blue-100 text-blue-800';
      case 'advisor': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'kn', name: 'Kannada' },
    { code: 'bn', name: 'Bengali' }
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-green-600" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getRoleColor(user?.role)}`}>
                      {user?.role}
                    </span>
                    {user?.isVerified && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">Verified</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">
                    Member since {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-primary flex items-center space-x-2"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Profile Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">State</label>
                      {isEditing ? (
                        <select
                          name="location.state"
                          value={formData.location.state}
                          onChange={handleInputChange}
                          className="form-input"
                        >
                          <option value="">Select State</option>
                          {indianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={formData.location.state}
                          disabled
                          className="form-input disabled:bg-gray-50"
                        />
                      )}
                    </div>
                    
                    <div>
                      <label className="form-label">District</label>
                      <input
                        type="text"
                        name="location.district"
                        value={formData.location.district}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Village/City</label>
                      <input
                        type="text"
                        name="location.village"
                        value={formData.location.village}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Bio</label>
                      <textarea
                        name="profile.bio"
                        rows={3}
                        value={formData.profile.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-50"
                        placeholder="Tell us about yourself and your farming experience..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Experience (years)</label>
                        <input
                          type="number"
                          name="profile.experience"
                          value={formData.profile.experience}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="form-input disabled:bg-gray-50"
                        />
                      </div>
                      
                      {user?.role === 'farmer' && (
                        <div>
                          <label className="form-label">Farm Size (acres)</label>
                          <input
                            type="number"
                            name="profile.farmSize"
                            value={formData.profile.farmSize}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="form-input disabled:bg-gray-50"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="form-label">
                        {user?.role === 'advisor' ? 'Specialization' : 'Crop Types'} (comma separated)
                      </label>
                      <input
                        type="text"
                        value={user?.role === 'advisor' 
                          ? formData.profile.specialization.join(', ')
                          : formData.profile.cropTypes.join(', ')
                        }
                        onChange={(e) => handleArrayInputChange(
                          user?.role === 'advisor' ? 'specialization' : 'cropTypes', 
                          e.target.value
                        )}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-50"
                        placeholder={user?.role === 'advisor' 
                          ? "e.g., Organic Farming, Pest Control, Soil Management"
                          : "e.g., Wheat, Rice, Tomatoes, Corn"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Preferred Language</label>
                      {isEditing ? (
                        <select
                          name="preferences.language"
                          value={formData.preferences.language}
                          onChange={handleInputChange}
                          className="form-input"
                        >
                          {languages.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={languages.find(l => l.code === formData.preferences.language)?.name || 'English'}
                          disabled
                          className="form-input disabled:bg-gray-50"
                        />
                      )}
                    </div>
                    
                    <div>
                      <label className="form-label">Notifications</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="preferences.notifications.email"
                            checked={formData.preferences.notifications.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Email notifications</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="preferences.notifications.sms"
                            checked={formData.preferences.notifications.sms}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">SMS notifications</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="preferences.notifications.push"
                            checked={formData.preferences.notifications.push}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Push notifications</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="spinner"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{user?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {user?.location?.village && user?.location?.district
                        ? `${user.location.village}, ${user.location.district}, ${user.location.state}`
                        : 'Location not provided'
                      }
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      Joined {formatDate(user?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity Summary */}
              {userActivity && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sprout className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">Crops</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {userActivity.totalActivity.crops}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">Products</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {userActivity.totalActivity.products}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-700">Forum Posts</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {userActivity.totalActivity.forumPosts}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-700">Forum Replies</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {userActivity.totalActivity.forumReplies}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Account Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Verification</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user?.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user?.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Last Login</span>
                    <span className="text-sm text-gray-900">
                      {user?.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
