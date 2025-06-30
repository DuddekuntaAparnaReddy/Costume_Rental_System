/**
 * Sorting Algorithms for Inventory Management
 */

export class SortingEngine {
  /**
   * Quick Sort implementation for large datasets
   */
  quickSort(arr, compareFunction) {
    if (arr.length <= 1) return arr;

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];
    const equal = [];

    for (const element of arr) {
      const comparison = compareFunction(element, pivot);
      if (comparison < 0) {
        left.push(element);
      } else if (comparison > 0) {
        right.push(element);
      } else {
        equal.push(element);
      }
    }

    return [
      ...this.quickSort(left, compareFunction),
      ...equal,
      ...this.quickSort(right, compareFunction)
    ];
  }

  /**
   * Merge Sort for stable sorting
   */
  mergeSort(arr, compareFunction) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid), compareFunction);
    const right = this.mergeSort(arr.slice(mid), compareFunction);

    return this.merge(left, right, compareFunction);
  }

  merge(left, right, compareFunction) {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (compareFunction(left[leftIndex], right[rightIndex]) <= 0) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  }

  /**
   * Sort costumes by popularity (rental frequency)
   */
  sortByPopularity(costumes, rentals) {
    const rentalCounts = new Map();
    
    rentals.forEach(rental => {
      const count = rentalCounts.get(rental.costumeId) || 0;
      rentalCounts.set(rental.costumeId, count + 1);
    });

    return this.quickSort(costumes, (a, b) => {
      const aCount = rentalCounts.get(a.id) || 0;
      const bCount = rentalCounts.get(b.id) || 0;
      return bCount - aCount; // Descending order
    });
  }

  /**
   * Sort costumes by rating (if ratings exist)
   */
  sortByRating(costumes, ratings = new Map()) {
    return this.mergeSort(costumes, (a, b) => {
      const aRating = ratings.get(a.id) || 0;
      const bRating = ratings.get(b.id) || 0;
      return bRating - aRating; // Descending order
    });
  }

  /**
   * Sort costumes by price
   */
  sortByPrice(costumes, ascending = true) {
    return this.quickSort(costumes, (a, b) => {
      return ascending ? a.price - b.price : b.price - a.price;
    });
  }

  /**
   * Sort costumes by availability and condition
   */
  sortByAvailabilityAndCondition(costumes) {
    const conditionPriority = { excellent: 3, good: 2, fair: 1 };
    
    return this.mergeSort(costumes, (a, b) => {
      // First sort by availability
      if (a.available !== b.available) {
        return b.available - a.available; // Available first
      }
      
      // Then by condition
      const aPriority = conditionPriority[a.condition] || 0;
      const bPriority = conditionPriority[b.condition] || 0;
      return bPriority - aPriority;
    });
  }

  /**
   * Multi-criteria sorting with weights
   */
  sortByMultipleCriteria(costumes, criteria) {
    return this.quickSort(costumes, (a, b) => {
      let score = 0;
      
      criteria.forEach(({ field, weight, ascending = true }) => {
        let comparison = 0;
        
        switch (field) {
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'available':
            comparison = b.available - a.available;
            break;
          case 'condition':
            const conditionValues = { excellent: 3, good: 2, fair: 1 };
            comparison = (conditionValues[b.condition] || 0) - (conditionValues[a.condition] || 0);
            break;
          default:
            comparison = 0;
        }
        
        if (!ascending) comparison = -comparison;
        score += comparison * weight;
      });
      
      return score;
    });
  }
}