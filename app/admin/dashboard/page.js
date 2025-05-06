'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  Users,
  Calendar,
  Settings,
  LogOut,
  Plus,
  Trash,
  Edit,
  FileText
} from 'lucide-react';
import Link from 'next/link';

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
  const router = useRouter();

  // Initialize with mock data
  useEffect(() => {
    setIsClient(true);
    
    // Check for admin token
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    // Mock news data
    setNewsItems([
      {
        _id: '1',
        title: 'Summer Training Camp Announced',
        content: 'Join us for our annual summer training camp. Open to all age groups, this intensive week-long camp focuses on skill development, tactical understanding, and fitness.',
        imageUrl: 'https://images.pexels.com/photos/3459979/pexels-photo-3459979.jpeg',
        createdAt: new Date('2023-06-15').toISOString()
      },
      {
        _id: '2',
        title: 'Team Wins Regional Championship',
        content: 'Congratulations to our senior team for winning the regional championship! After a nail-biting final match that went to penalties, our team emerged victorious.',
        imageUrl: 'https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg',
        createdAt: new Date('2023-06-05').toISOString()
      },
      {
        _id: '3',
        title: 'New Youth Coach Joins the Club',
        content: 'We\'re excited to welcome James Thompson to our coaching staff. James brings 15 years of experience working with youth players and will lead our U14 team.',
        imageUrl: 'https://images.pexels.com/photos/8224721/pexels-photo-8224721.jpeg',
        createdAt: new Date('2023-05-28').toISOString()
      }
    ]);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
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

  const handleDeleteNews = (id) => {
    // In a real app, you would call an API to delete the news
    // For this demo, just filter the news array
    const updatedNews = newsItems.filter(item => item._id !== id);
    setNewsItems(updatedNews);
  };

  const handleSubmitNews = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing news
      const updatedNews = newsItems.map(item => {
        if (item._id === currentNewsId) {
          return {
            ...item,
            ...newsFormData
          };
        }
        return item;
      });
      setNewsItems(updatedNews);
    } else {
      // Add new news
      const newNewsItem = {
        _id: Date.now().toString(),
        ...newsFormData,
        createdAt: new Date().toISOString()
      };
      setNewsItems([newNewsItem, ...newsItems]);
    }
    
    setShowNewsForm(false);
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
              <p className="text-2xl font-bold text-gray-900">124</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Upcoming Events</h3>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent News</h2>
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
                    onClick={() => handleEditNews(item)}
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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-primary-800 text-white">
        <div className="flex items-center justify-center h-16 border-b border-primary-700">
          <div className="text-lg font-bold">Panaroma Hills Soccer Club Admin</div>
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
              onClick={() => setActiveTab('events')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                activeTab === 'events' 
                  ? 'bg-primary-700 text-white' 
                  : 'text-primary-100 hover:bg-primary-700'
              }`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Events
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                activeTab === 'settings' 
                  ? 'bg-primary-700 text-white' 
                  : 'text-primary-100 hover:bg-primary-700'
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
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
          <div className="text-lg font-bold">Panaroma Hills Soccer Club Admin</div>
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
        <div className="grid grid-cols-5">
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
            onClick={() => setActiveTab('events')}
            className={`flex flex-col items-center py-2 ${
              activeTab === 'events' ? 'text-white' : 'text-primary-100'
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs mt-1">Events</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center py-2 ${
              activeTab === 'settings' ? 'text-white' : 'text-primary-100'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-64 flex-1">
        <main className="py-6 px-4 sm:px-6 md:py-8 md:px-8 bg-gray-100 min-h-screen">
          {activeTab === 'dashboard' && renderDashboardContent()}
          {activeTab === 'news' && renderNewsContent()}
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