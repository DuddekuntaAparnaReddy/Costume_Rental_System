/**
 * Greedy Algorithm for Booking Optimization
 * Finds the earliest available slot and prevents double-booking
 */

export class BookingOptimizer {
  constructor() {
    this.bookings = new Map(); // costumeId -> array of bookings
  }

  /**
   * Greedy algorithm to find the earliest available slot
   * @param {string} costumeId 
   * @param {string} requestedStart 
   * @param {string} requestedEnd 
   * @param {Array} existingRentals 
   * @returns {Object} booking result
   */
  findEarliestAvailableSlot(costumeId, requestedStart, requestedEnd, existingRentals) {
    const start = new Date(requestedStart);
    const end = new Date(requestedEnd);
    
    // Get all bookings for this costume
    const costumeBookings = existingRentals
      .filter(rental => rental.costumeId === costumeId && rental.status === 'active')
      .map(rental => ({
        start: new Date(rental.startDate),
        end: new Date(rental.endDate)
      }))
      .sort((a, b) => a.start - b.start);

    // Check if requested slot is available
    if (this.isSlotAvailable(start, end, costumeBookings)) {
      return {
        available: true,
        startDate: requestedStart,
        endDate: requestedEnd,
        message: 'Requested slot is available'
      };
    }

    // Greedy approach: find the earliest available slot after conflicts
    const earliestSlot = this.findNextAvailableSlot(start, end, costumeBookings);
    
    return {
      available: earliestSlot !== null,
      startDate: earliestSlot?.start.toISOString().split('T')[0],
      endDate: earliestSlot?.end.toISOString().split('T')[0],
      message: earliestSlot 
        ? 'Alternative slot found' 
        : 'No available slots in the near future'
    };
  }

  /**
   * Check if a time slot conflicts with existing bookings
   */
  isSlotAvailable(start, end, bookings) {
    return !bookings.some(booking => 
      (start < booking.end && end > booking.start)
    );
  }

  /**
   * Find the next available slot using greedy approach
   */
  findNextAvailableSlot(requestedStart, requestedEnd, bookings) {
    const duration = requestedEnd - requestedStart;
    let currentStart = new Date(requestedStart);
    
    // Try slots for the next 30 days
    const maxDate = new Date(currentStart);
    maxDate.setDate(maxDate.getDate() + 30);

    while (currentStart < maxDate) {
      const currentEnd = new Date(currentStart.getTime() + duration);
      
      if (this.isSlotAvailable(currentStart, currentEnd, bookings)) {
        return {
          start: new Date(currentStart),
          end: currentEnd
        };
      }
      
      // Move to next day
      currentStart.setDate(currentStart.getDate() + 1);
    }
    
    return null;
  }

  /**
   * Prevent double booking with conflict detection
   */
  validateBooking(costumeId, startDate, endDate, existingRentals) {
    const conflicts = existingRentals.filter(rental => {
      if (rental.costumeId !== costumeId || rental.status !== 'active') {
        return false;
      }
      
      const rentalStart = new Date(rental.startDate);
      const rentalEnd = new Date(rental.endDate);
      const bookingStart = new Date(startDate);
      const bookingEnd = new Date(endDate);
      
      return bookingStart < rentalEnd && bookingEnd > rentalStart;
    });

    return {
      isValid: conflicts.length === 0,
      conflicts: conflicts,
      message: conflicts.length > 0 
        ? 'Booking conflicts with existing rental' 
        : 'Booking is valid'
    };
  }
}