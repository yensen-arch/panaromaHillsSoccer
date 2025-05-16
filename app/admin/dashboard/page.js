'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  Users,
  Calendar,
  LogOut,
  Plus,
  Trash,
  Edit,
  FileText,
  Mail,
  X,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logout, checkAuth } from '@/lib/auth-client';

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newsFormData, setNewsFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentNewsId, setCurrentNewsId] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [contactQueries, setContactQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Initialize with real data
  useEffect(() => {
    setIsClient(true);
    
    // Check authentication
    const checkAuthentication = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        router.push('/admin/login');
        return;
      }
      fetchNews();
      fetchContactQueries();
    };
    
    checkAuthentication();
  }, [router]);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNewsItems(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Failed to fetch news",
        variant: "destructive",
      });
    }
  };

  const fetchContactQueries = async () => {
    try {
      const response = await fetch('/api/news/contact');
      if (!response.ok) throw new Error('Failed to fetch contact queries');
      const data = await response.json();
      setContactQueries(data);
    } catch (error) {
      console.error('Error fetching contact queries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contact queries",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsFormData({
      ...newsFormData,
      [name]: value
    });
  };

  const handleAddNews = () => {
    setIsEditing(false);
    setCurrentNewsId(null);
    setNewsFormData({
      title: '',
      content: '',
      imageUrl: '',
    });
    setShowNewsForm(true);
  };

  const handleEditNews = (newsItem) => {
    setIsEditing(true);
    setCurrentNewsId(newsItem._id);
    setNewsFormData({
      title: newsItem.title,
      content: newsItem.content,
      imageUrl: newsItem.imageUrl,
    });
    setShowNewsForm(true);
  };

  const handleDeleteNews = async (id) => {
    if (!confirm('Are you sure you want to delete this news item?')) {
      return;
    }

    try {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        toast({
          title: "Error",
          description: "You are not authorized. Please log in again.",
          variant: "destructive",
        });
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`/api/news?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Unauthorized",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          router.push('/admin/login');
          return;
        }
        throw new Error(data.error || 'Failed to delete news');
      }

      toast({
        title: "Success",
        description: "News deleted successfully",
      });

      fetchNews(); // Refresh the news list
    } catch (error) {
      console.error('Error deleting news:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete news',
        variant: "destructive",
      });
    }
  };

  const handleSubmitNews = async (e) => {
    e.preventDefault();

    try {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        toast({
          title: "Error",
          description: "You are not authorized. Please log in again.",
          variant: "destructive",
        });
        router.push('/admin/login');
        return;
      }

      const url = '/api/news';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(isEditing ? {
          _id: currentNewsId,
          ...newsFormData
        } : newsFormData),
        credentials: 'include' // This ensures cookies are sent with the request
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Unauthorized",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          router.push('/admin/login');
          return;
        }
        throw new Error(data.error || 'Failed to save news');
      }

      toast({
        title: "Success",
        description: isEditing ? "News updated successfully" : "News created successfully",
      });

      setShowNewsForm(false);
      fetchNews(); // Refresh the news list
    } catch (error) {
      console.error('Error saving news:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to save news',
        variant: "destructive",
      });
    }
  };

  const handleQueryClick = (query) => {
    setSelectedQuery(query);
    setShowQueryModal(true);
  };

  const handleUpdateStatus = async (queryId, newStatus) => {
    try {
      const response = await fetch(`/api/news/contact/${queryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      // Update local state
      setContactQueries(prev => 
        prev.map(query => 
          query._id === queryId 
            ? { ...query, status: newStatus }
            : query
        )
      );

      // Update selected query if it's the one being modified
      if (selectedQuery?._id === queryId) {
        setSelectedQuery(prev => ({ ...prev, status: newStatus }));
      }

      toast({
        title: "Success",
        description: "Query status updated successfully",
      });
    } catch (error) {
      console.error('Error updating query status:', error);
      toast({
        title: "Error",
        description: "Failed to update query status",
        variant: "destructive",
      });
    }
  };

  // Render loading state or redirect if not on client yet
  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const renderDashboardContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Newspaper className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">News Articles</h3>
              <p className="text-2xl font-bold text-gray-900">{newsItems.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Members</h3>
              <p className="text-2xl font-bold text-gray-900">To be made</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Recent News</h2>
          <button
            onClick={handleAddNews}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add News
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {newsItems.slice(0, 5).map((item) => (
              <div key={item._id} className="flex items-start p-4 border-b border-gray-100 last:border-0">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      handleEditNews(item);
                      setActiveTab('news');
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteNews(item._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNewsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">News Management</h2>
        <button
          onClick={handleAddNews}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add News
        </button>
      </div>
      
      {showNewsForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? 'Edit News' : 'Add News'}
          </h3>
          <form onSubmit={handleSubmitNews}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newsFormData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows="6"
                  value={newsFormData.content}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={newsFormData.imageUrl}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewsForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  {isEditing ? 'Update' : 'Publish'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preview
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {newsItems.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-md object-cover" 
                        src={item.imageUrl} 
                        alt={item.title} 
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {item.content.substring(0, 50)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditNews(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNews(item._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderQueryDetailsModal = () => {
    if (!selectedQuery) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Query Details</h3>
              <button
                onClick={() => setShowQueryModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-base font-medium text-gray-900">{selectedQuery.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-base font-medium text-gray-900">{selectedQuery.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-base font-medium text-gray-900">{selectedQuery.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Submitted</p>
                    <p className="text-base font-medium text-gray-900">
                      {new Date(selectedQuery.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Subject</h4>
                <p className="mt-2 text-base text-gray-900">
                  {selectedQuery.subject || 'No subject provided'}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Message</h4>
                <p className="mt-2 text-base text-gray-900 whitespace-pre-wrap">
                  {selectedQuery.message}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedQuery._id, 'new')}
                    className={`flex items-center px-3 py-2 rounded-md ${
                      selectedQuery.status === 'new'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    New
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedQuery._id, 'read')}
                    className={`flex items-center px-3 py-2 rounded-md ${
                      selectedQuery.status === 'read'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Read
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedQuery._id, 'responded')}
                    className={`flex items-center px-3 py-2 rounded-md ${
                      selectedQuery.status === 'responded'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Responded
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContactQueriesContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Contact Queries</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contactQueries.map((query) => (
                <tr 
                  key={query._id}
                  onClick={() => handleQueryClick(query)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{query.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{query.email}</div>
                    <div className="text-sm text-gray-500">{query.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{query.subject || 'No subject'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{query.message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(query.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      query.status === 'new' ? 'bg-green-100 text-green-800' :
                      query.status === 'read' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {query.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showQueryModal && renderQueryDetailsModal()}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-primary-800 text-white">
        <div className="flex items-center justify-center h-16 border-b border-primary-700">
          <div className="text-lg font-bold">Admin</div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                activeTab === 'dashboard' 
                  ? 'bg-primary-700 text-white' 
                  : 'text-primary-100 hover:bg-primary-700'
              }`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                activeTab === 'news' 
                  ? 'bg-primary-700 text-white' 
                  : 'text-primary-100 hover:bg-primary-700'
              }`}
            >
              <Newspaper className="mr-3 h-5 w-5" />
              News Management
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                activeTab === 'members' 
                  ? 'bg-primary-700 text-white' 
                  : 'text-primary-100 hover:bg-primary-700'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Members
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                activeTab === 'contact' 
                  ? 'bg-primary-700 text-white' 
                  : 'text-primary-100 hover:bg-primary-700'
              }`}
            >
              <Mail className="mr-3 h-5 w-5" />
              Contact Queries
            </button>
          </nav>
        </div>
        <div className="border-t border-primary-700 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center text-primary-100 hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-primary-800 text-white p-4 w-full fixed top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold"> Admin</div>
          <button
            onClick={handleLogout}
            className="flex items-center text-primary-100 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden bg-primary-700 text-white fixed bottom-0 w-full z-10">
        <div className="grid grid-cols-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-2 ${
              activeTab === 'dashboard' ? 'text-white' : 'text-primary-100'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`flex flex-col items-center py-2 ${
              activeTab === 'news' ? 'text-white' : 'text-primary-100'
            }`}
          >
            <Newspaper className="h-5 w-5" />
            <span className="text-xs mt-1">News</span>
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex flex-col items-center py-2 ${
              activeTab === 'members' ? 'text-white' : 'text-primary-100'
            }`}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Members</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex flex-col items-center py-2 ${
              activeTab === 'contact' ? 'text-white' : 'text-primary-100'
            }`}
          >
            <Mail className="h-5 w-5" />
            <span className="text-xs mt-1">Contact</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-64 flex-1">
        <main className="py-6 px-4 sm:px-6 md:py-8 md:px-8 bg-gray-100 min-h-screen">
          {activeTab === 'dashboard' && renderDashboardContent()}
          {activeTab === 'news' && renderNewsContent()}
          {activeTab === 'contact' && renderContactQueriesContent()}
          {activeTab === 'members' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Member Management</h2>
              <p className="text-gray-600">This feature is not implemented in the demo version.</p>
            </div>
          )}
          {activeTab === 'events' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Management</h2>
              <p className="text-gray-600">This feature is not implemented in the demo version.</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
              <p className="text-gray-600">This feature is not implemented in the demo version.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}