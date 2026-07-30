import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  User, Mail, Edit, Save, X, Camera, MapPin, Crown,
  Loader, Globe
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// SVG Icons (same as before)
const TwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GithubIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  
  // Load avatar from localStorage for guests
  const [localAvatar, setLocalAvatar] = useState(() => {
    return localStorage.getItem('guestAvatar') || null;
  });
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    socialLinks: {
      twitter: user?.socialLinks?.twitter || '',
      github: user?.socialLinks?.github || '',
      linkedin: user?.socialLinks?.linkedin || '',
    },
  });

  const isGuest = user?.role === 'guest' || !user?.id;

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.data.isGuest) {
          // Store avatar in localStorage for guest users
          localStorage.setItem('guestAvatar', data.data.url);
          setLocalAvatar(data.data.url);
          toast.success('Profile photo updated! (Guest mode)');
        } else {
          await updateProfile({ avatar: data.data.url });
          toast.success('Profile photo updated!');
        }
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      // If the API fails, still show the preview locally
      if (previewImage) {
        localStorage.setItem('guestAvatar', previewImage);
        setLocalAvatar(previewImage);
        toast.success('Photo saved locally (Guest mode)');
      } else {
        toast.error('Failed to upload image');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateProfile(formData);
    setLoading(false);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return 'U';
  };

  const getAvatar = () => {
    return previewImage || user?.avatar || localAvatar || null;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isGuest ? 'You are in guest mode. Register to save your profile!' : 'Manage your account settings'}
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              form="profile-form"
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {/* Guest Banner */}
      {isGuest && (
        <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-3">
          <span className="text-yellow-500">⚠️</span>
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            You're in guest mode. Your profile data is stored locally and will be lost if you clear your browser data.
            <button 
              onClick={() => window.location.href = '/auth/register'}
              className="ml-2 text-blue-500 hover:underline"
            >
              Create an account →
            </button>
          </p>
        </div>
      )}

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        {/* Profile Photo */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {getAvatar() ? (
                <img
                  src={getAvatar()}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials()
              )}
            </div>
            
            <div 
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center text-white">
                <Camera className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs">Change Photo</span>
              </div>
            </div>
            
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center">
                <Loader className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full capitalize">
                <User className="w-3 h-3" />
                {user?.role || 'Guest'}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full capitalize">
                <Crown className="w-3 h-3" />
                {user?.subscription?.plan || 'Free'}
              </span>
            </div>
          </div>
        </div>

        {/* Form - Only show if editing */}
        {isEditing && (
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                      !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                    !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                    !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className={`w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none ${
                  !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                placeholder="Tell us a bit about yourself..."
                maxLength={500}
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
                {formData.bio?.length || 0}/500
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                    !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                    !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium mb-3">Social Links</h3>
              <div className="space-y-3">
                <div className="relative">
                  <TwitterIcon className="absolute left-3 top-2.5 w-4 h-4 text-blue-400" />
                  <input
                    type="text"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                    })}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                      !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                    placeholder="Twitter username"
                  />
                </div>
                <div className="relative">
                  <GithubIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.socialLinks.github}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, github: e.target.value }
                    })}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                      !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                    placeholder="GitHub username"
                  />
                </div>
                <div className="relative">
                  <LinkedinIcon className="absolute left-3 top-2.5 w-4 h-4 text-blue-600" />
                  <input
                    type="text"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                    })}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                      !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                    placeholder="LinkedIn username"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Member since</span>
                  <div className="font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    }) : 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Saved Locations</span>
                  <div className="font-medium">
                    {user?.savedLocations?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Non-editing view - Show profile info */}
        {!isEditing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">First Name</div>
                <div className="font-medium">{user?.firstName || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Last Name</div>
                <div className="font-medium">{user?.lastName || 'N/A'}</div>
              </div>
            </div>
            
            {user?.bio && (
              <div>
                <div className="text-sm text-gray-500">Bio</div>
                <div className="font-medium">{user.bio}</div>
              </div>
            )}
            
            {user?.location && (
              <div>
                <div className="text-sm text-gray-500">Location</div>
                <div className="font-medium">{user.location}</div>
              </div>
            )}
            
            {user?.website && (
              <div>
                <div className="text-sm text-gray-500">Website</div>
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {user.website}
                </a>
              </div>
            )}

            {/* Social Links Display */}
            {(user?.socialLinks?.twitter || user?.socialLinks?.github || user?.socialLinks?.linkedin) && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium mb-3">Social Links</h3>
                <div className="flex gap-4">
                  {user.socialLinks.twitter && (
                    <a href={`https://twitter.com/${user.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                      <TwitterIcon className="w-5 h-5" />
                    </a>
                  )}
                  {user.socialLinks.github && (
                    <a href={`https://github.com/${user.socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                      <GithubIcon className="w-5 h-5" />
                    </a>
                  )}
                  {user.socialLinks.linkedin && (
                    <a href={`https://linkedin.com/in/${user.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                      <LinkedinIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}