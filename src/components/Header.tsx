import React from 'react';
import { LogOut, Crown, User, Shirt } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Shirt className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">CostumeWorld</h1>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              {user?.role === 'admin' ? (
                <>
                  <button
                    onClick={() => onViewChange('admin-dashboard')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'admin-dashboard'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => onViewChange('add-costume')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'add-costume'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    Add Costume
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onViewChange('catalog')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'catalog'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    Browse Costumes
                  </button>
                  <button
                    onClick={() => onViewChange('my-rentals')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'my-rentals'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    My Rentals
                  </button>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user?.role === 'admin' ? (
                <Crown className="h-5 w-5 text-amber-500" />
              ) : (
                <User className="h-5 w-5 text-purple-600" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;