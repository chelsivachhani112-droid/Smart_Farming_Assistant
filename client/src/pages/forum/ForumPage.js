import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  Pin,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForumPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    sortBy: 'createdAt',
    order: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/forum/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });

      const response = await axios.get(`/api/forum/posts?${params}`);
      setPosts(response.data.posts);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }));
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId, type) => {
    try {
      await axios.post(`/api/forum/posts/${postId}/vote`, { type });
      fetchPosts(); // Refresh posts to show updated votes
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(date);
  };

  const CreatePostModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      content: '',
      category: '',
      tags: '',
      location: {
        state: user?.location?.state || '',
        district: user?.location?.district || ''
      }
    });
    const [images, setImages] = useState([]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (key === 'location') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });

        images.forEach((image, index) => {
          formDataToSend.append('images', image);
        });

        await axios.post('/api/forum/posts', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        toast.success('Post created successfully');
        setShowCreateModal(false);
        fetchPosts();
      } catch (error) {
        toast.error('Failed to create post');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's your question or topic?"
                />
              </div>

              <div>
                <label className="form-label">Category</label>
                <select
                  required
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Content</label>
                <textarea
                  rows={6}
                  required
                  className="form-input"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Describe your question or share your knowledge..."
                />
              </div>

              <div>
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., wheat, disease, organic"
                />
              </div>

              <div>
                <label className="form-label">Images (optional)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="form-input"
                  onChange={(e) => setImages(Array.from(e.target.files))}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const PostCard = ({ post }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{post.author.name}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                {post.author.role}
              </span>
              {post.isPinned && <Pin className="w-4 h-4 text-orange-500" />}
              {post.isResolved && <CheckCircle className="w-4 h-4 text-green-500" />}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-3 h-3" />
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.location?.state && (
                <>
                  <MapPin className="w-3 h-3" />
                  <span>{post.location.state}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full capitalize">
          {post.category.replace('-', ' ')}
        </span>
      </div>

      {/* Post Content */}
      <Link to={`/forum/post/${post._id}`} className="block">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-700 mb-4 line-clamp-3">
          {post.content}
        </p>
      </Link>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
          )}
        </div>
      )}

      {/* Post Stats and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-4 h-4" />
            <span>{post.replies.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleVote(post._id, 'upvote')}
              className="flex items-center space-x-1 hover:text-green-600 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{post.votes.upvotes.length}</span>
            </button>
            <button
              onClick={() => handleVote(post._id, 'downvote')}
              className="flex items-center space-x-1 hover:text-red-600 transition-colors"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{post.votes.downvotes.length}</span>
            </button>
          </div>
        </div>

        <Link
          to={`/forum/post/${post._id}`}
          className="text-green-600 hover:text-green-700 font-medium text-sm"
        >
          View Discussion
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
            <p className="text-gray-600 mt-2">
              Connect with fellow farmers and share knowledge
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Post</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {categories.slice(0, 10).map((category) => (
            <button
              key={category.id}
              onClick={() => setFilters(prev => ({ ...prev, category: category.id }))}
              className={`p-4 rounded-lg border-2 transition-all ${
                filters.category === category.id
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-300'
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <h3 className="font-medium text-sm text-gray-900">{category.name}</h3>
              <p className="text-xs text-gray-600">{category.postCount} posts</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>

            <select
              className="form-input"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Location"
              className="form-input"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            />

            <select
              className="form-input"
              value={`${filters.sortBy}-${filters.order}`}
              onChange={(e) => {
                const [sortBy, order] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sortBy, order }));
              }}
            >
              <option value="createdAt-desc">Latest Posts</option>
              <option value="createdAt-asc">Oldest Posts</option>
              <option value="popular-desc">Most Popular</option>
              <option value="replies-desc">Most Replies</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            <p className="text-sm text-gray-600">Total Posts</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {posts.filter(p => p.isResolved).length}
            </p>
            <p className="text-sm text-gray-600">Resolved</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {posts.filter(p => !p.isResolved).length}
            </p>
            <p className="text-sm text-gray-600">Open</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {posts.reduce((sum, p) => sum + p.replies.length, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Replies</p>
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h2>
            <p className="text-gray-600 mb-6">Be the first to start a discussion!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`px-3 py-2 border rounded-lg ${
                      pagination.page === page
                        ? 'bg-green-600 text-white border-green-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Create Post Modal */}
        {showCreateModal && <CreatePostModal />}
      </div>
    </div>
  );
};

export default ForumPage;
