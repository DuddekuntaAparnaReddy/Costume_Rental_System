import React from 'react';
import { Calendar, DollarSign, Star, Tag } from 'lucide-react';
import { Costume } from '../types';

interface CostumeCardProps {
  costume: Costume;
  onRent?: (costume: Costume) => void;
  onDelete?: (costumeId: string) => void;
  isAdmin?: boolean;
}

const CostumeCard: React.FC<CostumeCardProps> = ({ 
  costume, 
  onRent, 
  onDelete, 
  isAdmin = false 
}) => {
  const conditionColors = {
    excellent: 'bg-emerald-100 text-emerald-800',
    good: 'bg-yellow-100 text-yellow-800',
    fair: 'bg-orange-100 text-orange-800'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={costume.image}
          alt={costume.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${conditionColors[costume.condition]}`}>
            {costume.condition}
          </span>
        </div>
        {!costume.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium">
              Currently Rented
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {costume.name}
          </h3>
          <div className="flex items-center space-x-1 text-purple-600">
            <DollarSign className="h-5 w-5" />
            <span className="text-xl font-bold">{costume.price}</span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {costume.description}
        </p>

        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Tag className="h-4 w-4" />
            <span>{costume.category}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-medium">Size:</span>
            <span>{costume.size}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          {isAdmin ? (
            <button
              onClick={() => onDelete?.(costume.id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete Costume
            </button>
          ) : (
            <button
              onClick={() => costume.available && onRent?.(costume)}
              disabled={!costume.available}
              className={`flex-1 font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                costume.available
                  ? 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {costume.available ? 'Rent Now' : 'Unavailable'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostumeCard;