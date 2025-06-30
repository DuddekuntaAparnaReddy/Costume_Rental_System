/**
 * Backtracking Algorithm for Complex Booking Constraints
 */

export class BacktrackingSearch {
  constructor() {
    this.solutions = [];
  }

  /**
   * Find costumes that match multiple complex criteria using backtracking
   */
  findMatchingCostumes(costumes, constraints, maxSolutions = 10) {
    this.solutions = [];
    const currentSolution = [];
    
    this.backtrack(costumes, constraints, currentSolution, 0, maxSolutions);
    
    return this.solutions.map(solution => ({
      costumes: [...solution],
      score: this.calculateSolutionScore(solution, constraints),
      satisfiedConstraints: this.countSatisfiedConstraints(solution, constraints)
    })).sort((a, b) => b.score - a.score);
  }

  /**
   * Backtracking algorithm implementation
   */
  backtrack(costumes, constraints, currentSolution, startIndex, maxSolutions) {
    if (this.solutions.length >= maxSolutions) return;

    // Check if current solution is valid and complete
    if (this.isValidSolution(currentSolution, constraints)) {
      this.solutions.push([...currentSolution]);
      return;
    }

    // Try adding each remaining costume
    for (let i = startIndex; i < costumes.length; i++) {
      const costume = costumes[i];
      
      // Check if adding this costume is promising
      if (this.isPromising(currentSolution, costume, constraints)) {
        currentSolution.push(costume);
        
        // Recursively search with this costume added
        this.backtrack(costumes, constraints, currentSolution, i + 1, maxSolutions);
        
        // Backtrack
        currentSolution.pop();
      }
    }
  }

  /**
   * Check if current solution satisfies all constraints
   */
  isValidSolution(solution, constraints) {
    if (solution.length === 0) return false;

    // Check minimum items constraint
    if (constraints.minItems && solution.length < constraints.minItems) {
      return false;
    }

    // Check maximum items constraint
    if (constraints.maxItems && solution.length > constraints.maxItems) {
      return false;
    }

    // Check budget constraint
    if (constraints.budget) {
      const totalCost = solution.reduce((sum, costume) => sum + costume.price, 0);
      if (totalCost > constraints.budget) return false;
    }

    // Check theme consistency
    if (constraints.themeConsistency) {
      const categories = new Set(solution.map(c => c.category));
      if (categories.size > 1) return false;
    }

    // Check size consistency
    if (constraints.sameSize) {
      const sizes = new Set(solution.map(c => c.size));
      if (sizes.size > 1) return false;
    }

    // Check color matching (if color data exists)
    if (constraints.colorMatch && constraints.requiredColor) {
      const hasRequiredColor = solution.some(costume => 
        costume.description.toLowerCase().includes(constraints.requiredColor.toLowerCase())
      );
      if (!hasRequiredColor) return false;
    }

    // Check availability
    const allAvailable = solution.every(costume => costume.available);
    if (!allAvailable) return false;

    // Check date availability
    if (constraints.startDate && constraints.endDate) {
      const hasConflict = solution.some(costume => 
        this.hasDateConflict(costume, constraints.startDate, constraints.endDate, constraints.existingRentals)
      );
      if (hasConflict) return false;
    }

    return true;
  }

  /**
   * Check if adding a costume to current solution is promising
   */
  isPromising(currentSolution, costume, constraints) {
    // Basic availability check
    if (!costume.available) return false;

    // Budget check
    if (constraints.budget) {
      const currentCost = currentSolution.reduce((sum, c) => sum + c.price, 0);
      if (currentCost + costume.price > constraints.budget) return false;
    }

    // Theme consistency check
    if (constraints.themeConsistency && currentSolution.length > 0) {
      const currentCategory = currentSolution[0].category;
      if (costume.category !== currentCategory) return false;
    }

    // Size consistency check
    if (constraints.sameSize && currentSolution.length > 0) {
      const currentSize = currentSolution[0].size;
      if (costume.size !== currentSize) return false;
    }

    // Condition quality check
    if (constraints.minCondition) {
      const conditionLevels = { excellent: 3, good: 2, fair: 1 };
      const requiredLevel = conditionLevels[constraints.minCondition] || 1;
      const costumeLevel = conditionLevels[costume.condition] || 1;
      if (costumeLevel < requiredLevel) return false;
    }

    // Date conflict check
    if (constraints.startDate && constraints.endDate) {
      if (this.hasDateConflict(costume, constraints.startDate, constraints.endDate, constraints.existingRentals)) {
        return false;
      }
    }

    // Maximum items check
    if (constraints.maxItems && currentSolution.length >= constraints.maxItems) {
      return false;
    }

    return true;
  }

  /**
   * Check if costume has date conflicts
   */
  hasDateConflict(costume, startDate, endDate, existingRentals = []) {
    const requestStart = new Date(startDate);
    const requestEnd = new Date(endDate);

    return existingRentals.some(rental => {
      if (rental.costumeId !== costume.id || rental.status !== 'active') {
        return false;
      }

      const rentalStart = new Date(rental.startDate);
      const rentalEnd = new Date(rental.endDate);

      return requestStart < rentalEnd && requestEnd > rentalStart;
    });
  }

  /**
   * Calculate score for a solution
   */
  calculateSolutionScore(solution, constraints) {
    let score = 0;

    // Base score from costume values
    solution.forEach(costume => {
      const conditionScores = { excellent: 100, good: 80, fair: 60 };
      score += conditionScores[costume.condition] || 50;
      
      // Bonus for popular categories
      const popularCategories = ['Superhero', 'Fantasy', 'Historical'];
      if (popularCategories.includes(costume.category)) {
        score += 20;
      }
    });

    // Budget efficiency bonus
    if (constraints.budget) {
      const totalCost = solution.reduce((sum, c) => sum + c.price, 0);
      const efficiency = totalCost / constraints.budget;
      score += efficiency * 50; // Bonus for using budget efficiently
    }

    // Theme consistency bonus
    if (constraints.themeConsistency) {
      const categories = new Set(solution.map(c => c.category));
      if (categories.size === 1) score += 100;
    }

    // Size consistency bonus
    if (constraints.sameSize) {
      const sizes = new Set(solution.map(c => c.size));
      if (sizes.size === 1) score += 50;
    }

    return score;
  }

  /**
   * Count how many constraints are satisfied
   */
  countSatisfiedConstraints(solution, constraints) {
    let satisfied = 0;
    let total = 0;

    // Budget constraint
    if (constraints.budget !== undefined) {
      total++;
      const totalCost = solution.reduce((sum, c) => sum + c.price, 0);
      if (totalCost <= constraints.budget) satisfied++;
    }

    // Theme consistency
    if (constraints.themeConsistency !== undefined) {
      total++;
      const categories = new Set(solution.map(c => c.category));
      if (categories.size <= 1) satisfied++;
    }

    // Size consistency
    if (constraints.sameSize !== undefined) {
      total++;
      const sizes = new Set(solution.map(c => c.size));
      if (sizes.size <= 1) satisfied++;
    }

    // Minimum condition
    if (constraints.minCondition) {
      total++;
      const conditionLevels = { excellent: 3, good: 2, fair: 1 };
      const requiredLevel = conditionLevels[constraints.minCondition] || 1;
      const allMeetCondition = solution.every(c => 
        (conditionLevels[c.condition] || 1) >= requiredLevel
      );
      if (allMeetCondition) satisfied++;
    }

    return { satisfied, total, percentage: total > 0 ? satisfied / total : 1 };
  }
}