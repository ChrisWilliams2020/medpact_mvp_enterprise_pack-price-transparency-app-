// components/auth/UserProfile.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function UserProfile() {
  const { profile, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    organization: profile?.organization || '',
    phone: profile?.phone || '',
    title: profile?.title || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await updateProfile(formData);
      if (!error) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-purple-100 text-purple-800',
      analyst: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    
    const icons = {
      admin: '👑',
      manager: '📊',
      analyst: '🔍',
      viewer: '👀'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[role] || styles.viewer}`}>
        <span className="mr-1">{icons[role] || icons.viewer}</span>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getSubscriptionBadge = (tier: string) => {
    const styles = {
      basic: 'bg-gray-100 text-gray-800',
      professional: 'bg-blue-100 text-blue-800',
      enterprise: 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[tier] || styles.basic}`}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">👤</span>
            User Profile
          </h3>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                ✏️ Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      full_name: profile?.full_name || '',
                      organization: profile?.organization || '',
                      phone: profile?.phone || '',
                      title: profile?.title || ''
                    });
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile?.full_name || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{profile?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile?.organization || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile?.phone || 'Not set'}</p>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile?.title || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              {getRoleBadge(profile?.role || 'viewer')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subscription</label>
              {getSubscriptionBadge(profile?.subscription_tier || 'basic')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
              <p className="text-gray-900">
                {profile?.last_login_at ? 
                  new Date(profile.last_login_at).toLocaleString() : 
                  'Never'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
              Change Password
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm">
              Download Data
            </button>
            <button 
              onClick={signOut}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}