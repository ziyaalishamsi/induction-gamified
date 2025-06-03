import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Module {
  id: string;
  name: string;
  title: string;
  duration: string;
  uploaded: boolean;
  fileUrl?: string;
  infographicUrl?: string;
}

interface Stats {
  totalUsers: number;
  completedUsers: number;
  averageCompletionTime: string;
  moduleCompletionRates: Record<string, number>;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState('modules');
  const [uploadingModule, setUploadingModule] = useState<string | null>(null);
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModule, setNewModule] = useState({
    name: '',
    title: '',
    duration: '',
    description: '',
    icon: '',
    color: 'bg-blue-500'
  });

  useEffect(() => {
    fetchModules();
    fetchStats();
  }, []);

  const handleAddModule = async () => {
    try {
      const response = await fetch('/api/admin/training-modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          moduleId: newModule.name.toLowerCase().replace(/\s+/g, '-'),
          ...newModule
        })
      });

      if (response.ok) {
        setShowAddModule(false);
        setNewModule({
          name: '',
          title: '',
          duration: '',
          description: '',
          icon: '',
          color: 'bg-blue-500'
        });
        fetchModules();
        alert('Training module added successfully!');
      } else {
        alert('Failed to add training module');
      }
    } catch (error) {
      console.error('Error adding module:', error);
      alert('Error adding training module');
    }
  };

  const fetchModules = async () => {
    try {
      const response = await fetch('/cityofciti/api/admin/modules');
      if (response.ok) {
        const data = await response.json();
        setModules(data);
      }
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/cityofciti/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleFileUpload = async (moduleId: string, file: File) => {
    setUploadingModule(moduleId);
    
    try {
      const formData = new FormData();
      formData.append('presentation', file);
      
      const response = await fetch(`/cityofciti/api/admin/upload/${moduleId}`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`File uploaded successfully for ${moduleId}: ${result.originalname}`);
        // Refresh modules list to show updated status
        fetchModules();
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploadingModule(null);
    }
  };

  if (!user || (user.role !== 'Admin' && user.role !== 'admin' && user.username !== 'admin@citi.com')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
          <p className="text-gray-500 text-sm mt-2">Please login with admin credentials: admin@citi.com</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage training modules and track completion statistics</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('modules')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'modules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Module Management
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Statistics
            </button>
          </nav>
        </div>

        {activeTab === 'modules' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Training Modules</h2>
              <button
                onClick={() => setShowAddModule(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                + Add New Module
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <div key={module.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{module.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      module.uploaded
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {module.uploaded ? 'Uploaded' : 'Pending'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{module.title}</p>
                  <p className="text-sm text-gray-500 mb-4">Duration: {module.duration}</p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Presentation File (PDF/PPT)
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.ppt,.pptx"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(module.id, e.target.files[0]);
                          }
                        }}
                        disabled={uploadingModule === module.id}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Infographic Link
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {uploadingModule === module.id && (
                      <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600">
                          <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                          Uploading...
                        </div>
                      </div>
                    )}

                    {module.uploaded && (
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-xs hover:bg-blue-700">
                          View Content
                        </button>
                        <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-xs hover:bg-gray-700">
                          Edit Metadata
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && stats && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Completion Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-gray-600">Total Users</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stats.completedUsers}</p>
                    <p className="text-gray-600">Completed Training</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">⏱️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stats.averageCompletionTime}</p>
                    <p className="text-gray-600">Avg. Completion Time</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Completion Rates</h3>
              <div className="space-y-4">
                {Object.entries(stats.moduleCompletionRates).map(([moduleId, rate]) => {
                  const module = modules.find(m => m.id === moduleId);
                  return (
                    <div key={moduleId} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {module?.name || moduleId}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${rate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">{rate}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Add New Module Modal */}
        {showAddModule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Training Module</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module Name</label>
                  <input
                    type="text"
                    value={newModule.name}
                    onChange={(e) => setNewModule({...newModule, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Customer Service Excellence"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module Title</label>
                  <input
                    type="text"
                    value={newModule.title}
                    onChange={(e) => setNewModule({...newModule, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Excellence in Customer Service Delivery"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newModule.duration}
                    onChange={(e) => setNewModule({...newModule, duration: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 45 min"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newModule.description}
                    onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Brief description of the training module..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={newModule.icon}
                    onChange={(e) => setNewModule({...newModule, icon: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 🎯"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
                  <select
                    value={newModule.color}
                    onChange={(e) => setNewModule({...newModule, color: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="bg-blue-500">Blue</option>
                    <option value="bg-green-500">Green</option>
                    <option value="bg-purple-500">Purple</option>
                    <option value="bg-red-500">Red</option>
                    <option value="bg-yellow-500">Yellow</option>
                    <option value="bg-indigo-500">Indigo</option>
                    <option value="bg-pink-500">Pink</option>
                    <option value="bg-orange-500">Orange</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModule(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddModule}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Add Module
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}