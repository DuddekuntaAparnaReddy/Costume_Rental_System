import React from 'react';
import { Calendar, Clock, DollarSign, Package } from 'lucide-react';

const MyRentals = ({ 
  rentals, 
  costumes, 
  onReturnCostume, 
  onCancelRental 
}) => {
  const getRentalCostume = (costumeId) => {
    return costumes.find(c => c.id === costumeId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'returned':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rentals</h1>
        <p className="text-gray-600">Track your current and past costume rentals</p>
      </div>

      {rentals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No rentals yet</h3>
          <p className="text-gray-600">Browse our catalog to rent your first costume!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {rentals.map((rental) => {
            const costume = getRentalCostume(rental.costumeId);
            if (!costume) return null;

            return (
              <div key={rental.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                  <div className="flex-shrink-0">
                    <img
                      src={costume.image}
                      alt={costume.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{costume.name}</h3>
                        <p className="text-gray-600">{costume.category} • Size {costume.size}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rental.status)}`}>
                        {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">Start Date</p>
                          <p className="text-sm">{formatDate(rental.startDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">End Date</p>
                          <p className="text-sm">{formatDate(rental.endDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">Total Cost</p>
                          <p className="text-sm font-bold">${rental.totalCost}</p>
                        </div>
                      </div>
                    </div>

                    {rental.status === 'active' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => onReturnCostume(rental.id)}
                          className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                          Return Costume
                        </button>
                        <button
                          onClick={() => onCancelRental(rental.id)}
                          className="px-4 py-2 border border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Cancel Rental
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRentals;