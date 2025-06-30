import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Sparkles, TrendingUp } from 'lucide-react';
import CostumeCard from '../CostumeCard.jsx';
import { SearchEngine } from '../../algorithms/searchAlgorithms.js';
import { SortingEngine } from '../../algorithms/sortingAlgorithms.js';
import { RecommendationEngine } from '../../algorithms/recommendationSystem.js';

const CostumeCatalog = ({ costumes, onRentCostume, userRentals = [], allRentals = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [filteredCostumes, setFilteredCostumes] = useState(costumes);
  const [recommendations, setRecommendations] = useState([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchEngine = new SearchEngine();
  const sortingEngine = new SortingEngine();
  const recommendationEngine = new RecommendationEngine();

  const categories = [...new Set(costumes.map(c => c.category))];

  useEffect(() => {
    // Build search trie when costumes change
    searchEngine.buildTrie(costumes);
    
    // Get recommendations based on user's rental history
    if (userRentals.length > 0) {
      const userId = userRentals[0]?.userId;
      if (userId) {
        const recs = recommendationEngine.getCollaborativeRecommendations(
          userId, userRentals, allRentals, costumes, 4
        );
        setRecommendations(recs);
      }
    } else {
      // Show popular recommendations for new users
      const popularRecs = recommendationEngine.getPopularRecommendations(allRentals, costumes, 4);
      setRecommendations(popularRecs);
    }
  }, [costumes, userRentals, allRentals]);

  useEffect(() => {
    let result = [...costumes];

    // Apply search and filters
    if (searchTerm) {
      // Use advanced search with multiple algorithms
      const searchResults = searchEngine.advancedSearch(costumes, {
        searchText: searchTerm,
        category: selectedCategory,
        availableOnly: showAvailableOnly
      });
      
      // If no exact matches, try fuzzy search
      if (searchResults.length === 0) {
        result = searchEngine.fuzzySearch(costumes, searchTerm, 2);
      } else {
        result = searchResults;
      }
    } else {
      // Apply filters without search
      result = costumes.filter(costume => {
        const matchesCategory = !selectedCategory || costume.category === selectedCategory;
        const matchesAvailability = !showAvailableOnly || costume.available;
        return matchesCategory && matchesAvailability;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price':
        result = sortingEngine.sortByPrice(result, true);
        break;
      case 'priceDesc':
        result = sortingEngine.sortByPrice(result, false);
        break;
      case 'popularity':
        result = sortingEngine.sortByPopularity(result, allRentals);
        break;
      case 'availability':
        result = sortingEngine.sortByAvailabilityAndCondition(result);
        break;
      case 'name':
      default:
        result = sortingEngine.quickSort(result, (a, b) => a.name.localeCompare(b.name));
    }

    setFilteredCostumes(result);
  }, [searchTerm, selectedCategory, showAvailableOnly, sortBy, costumes, allRentals]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    
    if (value.length > 1) {
      const suggestions = searchEngine.getAutocompleteSuggestions(value, 5);
      setAutocompleteSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Costume Catalog</h1>
        <p className="text-gray-600">Discover and rent amazing costumes for any occasion</p>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((costume) => (
              <div key={costume.id} className="transform scale-95">
                <CostumeCard
                  costume={costume}
                  onRent={onRentCostume}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Search costumes..."
              />
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && autocompleteSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {autocompleteSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      <div className="font-medium">{suggestion.text}</div>
                      <div className="text-sm text-gray-500">{suggestion.category}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price">Price (Low to High)</option>
              <option value="priceDesc">Price (High to Low)</option>
              <option value="popularity">Most Popular</option>
              <option value="availability">Available First</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Available only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredCostumes.length} of {costumes.length} costumes
        </p>
        {searchTerm && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <TrendingUp className="h-4 w-4" />
            <span>Smart search active</span>
          </div>
        )}
      </div>

      {/* Costumes Grid */}
      {filteredCostumes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No costumes found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCostumes.map((costume) => (
            <CostumeCard
              key={costume.id}
              costume={costume}
              onRent={onRentCostume}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CostumeCatalog;