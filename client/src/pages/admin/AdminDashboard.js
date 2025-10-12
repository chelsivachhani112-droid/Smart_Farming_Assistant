import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  MessageSquare,
  Settings,
  BarChart3,
  Shield,
  Bell,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
  AlertTriangle,
  Activity
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchPendingApprovals();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const response = await axios.get('/api/admin/pending');
      setPendingApprovals(response.data);
    } catch (error) {
      console.error('Failed to fetch pending approvals:', error);
    }
  };

  const handleApproval = async (type, id, approved, reason = '') => {
    try {
      await axios.put(`/api/admin/${type}/${id}/approve`, { approved, reason });
      toast.success(`${type} ${approved ? 'approved' : 'rejected'} successfully`);
      fetchPendingApprovals();
      fetchDashboardData();
    } catch (error) {
      toast.error(`Failed to ${approved ? 'approve' : 'reject'} ${type}`);
    }
  };

  const sidebarItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/products', icon: Package, label: 'Product Management' },
    { path: '/admin/forum', icon: MessageSquare, label: 'Forum Management' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const OverviewDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData?.overview?.users?.total || 0}
              </p>
              <p className="text-sm text-green-600">
                +{dashboardData?.overview?.users?.growthRate || 0}% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData?.overview?.products?.approved || 0}
              </p>
              <p className="text-sm text-yellow-600">
                {dashboardData?.overview?.products?.pending || 0} pending
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Forum Posts</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData?.overview?.forum?.total || 0}
              </p>
              <p className="text-sm text-green-600">
                {dashboardData?.overview?.forum?.resolutionRate || 0}% resolved
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Healthy Crops</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData?.overview?.crops?.healthRate || 0}%
              </p>
              <p className="text-sm text-red-600">
                {dashboardData?.overview?.crops?.withIssues || 0} with issues
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingApprovals && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Products</h3>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                {pendingApprovals.products?.length || 0}
              </span>
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {pendingApprovals.products?.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                      by {product.seller.name} • {product.category}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{product.price.amount}/{product.price.unit}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproval('products', product._id, true)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApproval('products', product._id, false)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/marketplace/product/${product._id}`}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Forum Posts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Forum Posts</h3>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                {pendingApprovals.posts?.length || 0}
              </span>
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {pendingApprovals.posts?.slice(0, 5).map((post) => (
                <div key={post._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{post.title}</h4>
                    <p className="text-sm text-gray-600">
                      by {post.author.name} • {post.category}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproval('posts', post._id, true)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApproval('posts', post._id, false)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
          <div className="space-y-3">
            {dashboardData?.recentActivity?.users?.map((user) => (
              <div key={user._id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h3>
          <div className="space-y-3">
            {dashboardData?.recentActivity?.products?.map((product) => (
              <div key={product._id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">₹{product.price.amount}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Forum Posts</h3>
          <div className="space-y-3">
            {dashboardData?.recentActivity?.posts?.map((post) => (
              <div key={post._id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                  <p className="text-sm text-gray-600">{post.views} views</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-medium text-gray-900">Database</p>
            <p className="text-sm text-green-600">Connected</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <p className="font-medium text-gray-900">Performance</p>
            <p className="text-sm text-blue-600">Good</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="font-medium text-gray-900">Alerts</p>
            <p className="text-sm text-yellow-600">2 Warnings</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <p className="font-medium text-gray-900">Uptime</p>
            <p className="text-sm text-purple-600">99.9%</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-600">Smart Farming Assistant</p>
          </div>
          
          <nav className="mt-6">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive(item.path, item.exact)
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<OverviewDashboard />} />
            <Route path="/users" element={<div>User Management (Coming Soon)</div>} />
            <Route path="/products" element={<div>Product Management (Coming Soon)</div>} />
            <Route path="/forum" element={<div>Forum Management (Coming Soon)</div>} />
            <Route path="/analytics" element={<div>Analytics (Coming Soon)</div>} />
            <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
