import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, AlertTriangle, CheckCircle, CreditCard, Truck } from 'lucide-react';
import { BookingOptimizer } from '../algorithms/greedyBooking.js';

const RentalModal = ({ costume, onClose, onConfirm, existingRentals = [] }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [bookingResult, setBookingResult] = useState(null);
  const [showOptimization, setShowOptimization] = useState(false);

  const bookingOptimizer = new BookingOptimizer();

  const calculateTotalCost = () => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays * costume.price;
  };

  const totalCost = calculateTotalCost();
  const minDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (startDate && endDate) {
      // Check booking optimization
      const result = bookingOptimizer.findEarliestAvailableSlot(
        costume.id, 
        startDate, 
        endDate, 
        existingRentals
      );
      setBookingResult(result);
      
      // Show optimization suggestion if dates are different
      if (!result.available || 
          (result.startDate !== startDate || result.endDate !== endDate)) {
        setShowOptimization(true);
      } else {
        setShowOptimization(false);
      }
    }
  }, [startDate, endDate, costume.id, existingRentals]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate booking
    const validation = bookingOptimizer.validateBooking(
      costume.id, 
      startDate, 
      endDate, 
      existingRentals
    );
    
    if (!validation.isValid) {
      alert('Booking conflicts with existing rental. Please choose different dates.');
      return;
    }
    
    if (startDate && endDate && totalCost > 0) {
      onConfirm(startDate, endDate, totalCost, paymentMethod);
    }
  };

  const handleOptimizedBooking = () => {
    if (bookingResult && bookingResult.available) {
      setStartDate(bookingResult.startDate);
      setEndDate(bookingResult.endDate);
      setShowOptimization(false);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Rent Costume</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            <img
              src={costume.image}
              alt={costume.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{costume.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{costume.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{costume.category} • Size {costume.size}</span>
              <span className="text-purple-600 font-bold">${costume.price}/day</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Available: {costume.quantity} of {costume.totalQuantity}
            </div>
          </div>

          {/* Booking Optimization Alert */}
          {showOptimization && bookingResult && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-amber-800">Booking Optimization</h4>
                  <p className="text-sm text-amber-700 mt-1">{bookingResult.message}</p>
                  {bookingResult.available && (
                    <button
                      onClick={handleOptimizedBooking}
                      className="mt-2 text-sm bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors"
                    >
                      Use Suggested Dates
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  min={minDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  min={startDate || minDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <div className="ml-3 flex items-center">
                    <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Online Payment</div>
                      <div className="text-xs text-gray-500">Pay securely with card</div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <div className="ml-3 flex items-center">
                    <Truck className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Cash on Delivery</div>
                      <div className="text-xs text-gray-500">Pay when you receive</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Booking Status */}
            {bookingResult && startDate && endDate && (
              <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                bookingResult.available 
                  ? 'bg-emerald-50 border border-emerald-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {bookingResult.available ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-emerald-700">Dates are available!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-sm text-red-700">Dates conflict with existing booking</span>
                  </>
                )}
              </div>
            )}

            {totalCost > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Total Cost:</span>
                  <span className="text-2xl font-bold text-purple-600">${totalCost}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days @ ${costume.price}/day
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Payment: {paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}
                </p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!startDate || !endDate || totalCost <= 0 || (bookingResult && !bookingResult.available)}
                className="flex-1 px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {paymentMethod === 'online' ? 'Pay Now' : 'Confirm Rental'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RentalModal;