import React from 'react';
import { Package, Users, TrendingUp, Calendar } from 'lucide-react';
import { mockCostumes, mockRentals, mockUsers } from '../../data/mockData';
import CostumeCard from '../CostumeCard';

interface AdminDashboardProps {
  costumes: typeof mockCostumes;
  onDeleteCostume: (costumeId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ costumes, onDeleteCostume }) => {
  const totalCostumes = costumes.length;
  const availableCostumes = costumes.filter(c => c.available).length;
  const totalUsers = mockUsers.filter(u => u.role === 'user').length;
  const activeRentals = mockRentals.filter(r => r.status === 'active').length;

  const stats = [
    {
      name: 'Total Costumes',
      value: totalCostumes,
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      name: 'Available',
      value: availableCostumes,
      icon: TrendingUp,
      color: 'bg-emerald-500'
    },
    {
      name: 'Active Rentals',
      value: activeRentals,
      icon: Calendar,
      color: 'bg-amber-500'
    },
    {
      name: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your costume inventory and track rentals</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Costumes Grid */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Costume Inventory</h2>
        {costumes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No costumes yet</h3>
            <p className="text-gray-600">Add your first costume to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {costumes.map((costume) => (
              <CostumeCard
                key={costume.id}
                costume={costume}
                onDelete={onDeleteCostume}
                isAdmin={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;