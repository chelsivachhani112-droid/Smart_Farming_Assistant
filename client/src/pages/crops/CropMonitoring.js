import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Sprout,
  Camera,
  Activity,
  AlertTriangle,
  Calendar,
  Droplets,
  Thermometer,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Upload
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CropMonitoring = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await axios.get('/api/crops');
      setCrops(response.data);
    } catch (error) {
      toast.error('Failed to fetch crops');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getHealthScore = (crop) => {
    if (crop.healthStatus?.status === 'healthy') return 85;
    if (crop.healthStatus?.status === 'warning') return 60;
    if (crop.healthStatus?.status === 'critical') return 30;
    return 50;
  };

  const AddCropModal = () => {
    const [formData, setFormData] = useState({
      cropName: '',
      variety: '',
      plantingDate: '',
      fieldSize: '',
      location: {
        fieldName: '',
        coordinates: { latitude: '', longitude: '' }
      }
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post('/api/crops', formData);
        toast.success('Crop added successfully');
        setShowAddModal(false);
        fetchCrops();
      } catch (error) {
        toast.error('Failed to add crop');
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name.includes('location.')) {
        const field = name.split('.')[1];
        if (field === 'coordinates') {
          const coord = name.split('.')[2];
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: {
                ...prev.location.coordinates,
                [coord]: value
              }
            }
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              [field]: value
            }
          }));
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h2 className="text-xl font-semibold mb-4">Add New Crop</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Crop Name</label>
              <input
                type="text"
                name="cropName"
                required
                className="form-input"
                value={formData.cropName}
                onChange={handleChange}
                placeholder="e.g., Wheat, Rice, Corn"
              />
            </div>
            
            <div>
              <label className="form-label">Variety</label>
              <input
                type="text"
                name="variety"
                className="form-input"
                value={formData.variety}
                onChange={handleChange}
                placeholder="e.g., Basmati, Hybrid"
              />
            </div>
            
            <div>
              <label className="form-label">Planting Date</label>
              <input
                type="date"
                name="plantingDate"
                required
                className="form-input"
                value={formData.plantingDate}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="form-label">Field Size (acres)</label>
              <input
                type="number"
                name="fieldSize"
                required
                step="0.1"
                className="form-input"
                value={formData.fieldSize}
                onChange={handleChange}
                placeholder="e.g., 2.5"
              />
            </div>
            
            <div>
              <label className="form-label">Field Name</label>
              <input
                type="text"
                name="location.fieldName"
                className="form-input"
                value={formData.location.fieldName}
                onChange={handleChange}
                placeholder="e.g., North Field, Plot A"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 btn-primary">
                Add Crop
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ImageUploadModal = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = (e) => {
      setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
      if (!selectedFile || !selectedCrop) return;

      const formData = new FormData();
      formData.append('image', selectedFile);

      setUploading(true);
      try {
        const response = await axios.post(`/api/crops/${selectedCrop._id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        toast.success('Image uploaded and analyzed successfully');
        setShowImageUpload(false);
        setSelectedFile(null);
        fetchCrops();
        
        if (response.data.image.analysis.diseaseDetected) {
          toast.warning('Potential disease detected! Check recommendations.');
        }
      } catch (error) {
        toast.error('Failed to upload image');
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h2 className="text-xl font-semibold mb-4">Upload Crop Image</h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">Select Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="form-input"
              />
            </div>
            
            {selectedFile && (
              <div className="text-sm text-gray-600">
                Selected: {selectedFile.name}
              </div>
            )}
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowImageUpload(false);
                  setSelectedFile(null);
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {uploading ? 'Analyzing...' : 'Upload & Analyze'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Crop Monitoring</h1>
            <p className="text-gray-600 mt-2">
              Monitor your crops' health and track their progress
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Crop</span>
          </button>
        </div>

        {crops.length === 0 ? (
          <div className="text-center py-12">
            <Sprout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No crops added yet</h2>
            <p className="text-gray-600 mb-6">
              Start monitoring your crops by adding your first crop
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Add Your First Crop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <div key={crop._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Crop Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Sprout className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{crop.cropName}</h3>
                        <p className="text-sm text-gray-600">{crop.variety || 'Standard variety'}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(crop.healthStatus?.status || 'unknown')}`}>
                      {crop.healthStatus?.status || 'Unknown'}
                    </span>
                  </div>

                  {/* Health Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Health Score</span>
                      <span className="text-sm font-bold text-gray-900">{getHealthScore(crop)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          getHealthScore(crop) >= 80 ? 'bg-green-500' :
                          getHealthScore(crop) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${getHealthScore(crop)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Crop Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Field Size:</span>
                      <p className="font-medium">{crop.fieldSize} acres</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Planted:</span>
                      <p className="font-medium">
                        {new Date(crop.plantingDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Camera className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Images</p>
                      <p className="font-semibold">{crop.images?.length || 0}</p>
                    </div>
                    <div>
                      <Activity className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Sensors</p>
                      <p className="font-semibold">{crop.sensorData?.length || 0}</p>
                    </div>
                    <div>
                      <Droplets className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Irrigation</p>
                      <p className="font-semibold">{crop.irrigationSchedule?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCrop(crop);
                        setShowImageUpload(true);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Image</span>
                    </button>
                    <Link
                      to={`/crops/${crop._id}`}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>

                {/* Recent Issues */}
                {crop.healthStatus?.issues && crop.healthStatus.issues.length > 0 && (
                  <div className="p-4 bg-yellow-50 border-t border-yellow-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Recent Issues</span>
                    </div>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      {crop.healthStatus.issues.slice(0, 2).map((issue, index) => (
                        <li key={index}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {showAddModal && <AddCropModal />}
        {showImageUpload && <ImageUploadModal />}
      </div>
    </div>
  );
};

export default CropMonitoring;
