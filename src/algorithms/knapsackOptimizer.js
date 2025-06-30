/**
 * Knapsack Problem for Budget-Optimized Combo Rentals
 */

export class KnapsackOptimizer {
  /**
   * 0/1 Knapsack for exact-fit combinations within budget
   */
  optimizeRentalCombo(costumes, budget, maxItems = 5) {
    const n = Math.min(costumes.length, maxItems);
    const dp = Array(n + 1).fill(null).map(() => Array(budget + 1).fill(0));
    const selected = Array(n + 1).fill(null).map(() => Array(budget + 1).fill(false));

    // Fill the DP table
    for (let i = 1; i <= n; i++) {
      const costume = costumes[i - 1];
      const price = Math.floor(costume.price);
      
      for (let w = 0; w <= budget; w++) {
        // Don't include current costume
        dp[i][w] = dp[i - 1][w];
        
        // Include current costume if it fits
        if (price <= w) {
          const includeValue = dp[i - 1][w - price] + this.calculateCostumeValue(costume);
          if (includeValue > dp[i][w]) {
            dp[i][w] = includeValue;
            selected[i][w] = true;
          }
        }
      }
    }

    // Backtrack to find selected costumes
    const selectedCostumes = [];
    let w = budget;
    
    for (let i = n; i > 0 && w > 0; i--) {
      if (selected[i][w]) {
        selectedCostumes.push(costumes[i - 1]);
        w -= Math.floor(costumes[i - 1].price);
      }
    }

    return {
      costumes: selectedCostumes,
      totalValue: dp[n][budget],
      totalCost: selectedCostumes.reduce((sum, c) => sum + c.price, 0),
      remainingBudget: budget - selectedCostumes.reduce((sum, c) => sum + Math.floor(c.price), 0)
    };
  }

  /**
   * Calculate value of a costume for knapsack optimization
   */
  calculateCostumeValue(costume) {
    let value = 0;
    
    // Base value from condition
    const conditionValues = { excellent: 100, good: 80, fair: 60 };
    value += conditionValues[costume.condition] || 50;
    
    // Availability bonus
    if (costume.available) {
      value += 50;
    }
    
    // Category popularity bonus (you can adjust based on data)
    const popularCategories = ['Superhero', 'Fantasy', 'Historical'];
    if (popularCategories.includes(costume.category)) {
      value += 30;
    }
    
    // Price efficiency (higher value for lower price)
    value += Math.max(0, 100 - costume.price);
    
    return value;
  }

  /**
   * Fractional Knapsack for maximum value within budget
   */
  fractionalKnapsack(costumes, budget) {
    // Calculate value-to-price ratio for each costume
    const costumeRatios = costumes
      .filter(c => c.available)
      .map(costume => ({
        costume,
        ratio: this.calculateCostumeValue(costume) / costume.price,
        price: costume.price
      }))
      .sort((a, b) => b.ratio - a.ratio);

    const selected = [];
    let remainingBudget = budget;
    let totalValue = 0;

    for (const item of costumeRatios) {
      if (remainingBudget >= item.price) {
        // Take the whole costume
        selected.push({
          costume: item.costume,
          fraction: 1,
          cost: item.price
        });
        remainingBudget -= item.price;
        totalValue += this.calculateCostumeValue(item.costume);
      } else if (remainingBudget > 0) {
        // Take partial (for rental days)
        const fraction = remainingBudget / item.price;
        selected.push({
          costume: item.costume,
          fraction,
          cost: remainingBudget
        });
        totalValue += this.calculateCostumeValue(item.costume) * fraction;
        remainingBudget = 0;
        break;
      }
    }

    return {
      selection: selected,
      totalValue,
      totalCost: budget - remainingBudget,
      efficiency: totalValue / (budget - remainingBudget)
    };
  }

  /**
   * Multi-dimensional knapsack for complex constraints
   */
  multiConstraintKnapsack(costumes, constraints) {
    const { budget, maxWeight, maxItems, requiredCategories } = constraints;
    
    // Filter costumes that meet basic requirements
    let validCostumes = costumes.filter(costume => {
      if (!costume.available) return false;
      if (costume.price > budget) return false;
      if (requiredCategories && !requiredCategories.includes(costume.category)) return false;
      return true;
    });

    // Use dynamic programming with multiple constraints
    const result = this.optimizeWithMultipleConstraints(
      validCostumes, 
      budget, 
      maxWeight || Infinity, 
      maxItems || validCostumes.length
    );

    return result;
  }

  optimizeWithMultipleConstraints(costumes, budget, maxWeight, maxItems) {
    const n = costumes.length;
    const memo = new Map();

    const solve = (index, remainingBudget, remainingWeight, remainingItems) => {
      if (index >= n || remainingItems <= 0) return { value: 0, items: [] };
      
      const key = `${index}-${remainingBudget}-${remainingWeight}-${remainingItems}`;
      if (memo.has(key)) return memo.get(key);

      const costume = costumes[index];
      const weight = this.getCostumeWeight(costume);
      
      // Option 1: Don't take current costume
      const withoutCurrent = solve(index + 1, remainingBudget, remainingWeight, remainingItems);
      
      // Option 2: Take current costume (if constraints allow)
      let withCurrent = { value: 0, items: [] };
      if (costume.price <= remainingBudget && weight <= remainingWeight) {
        const subResult = solve(
          index + 1, 
          remainingBudget - costume.price, 
          remainingWeight - weight, 
          remainingItems - 1
        );
        withCurrent = {
          value: subResult.value + this.calculateCostumeValue(costume),
          items: [costume, ...subResult.items]
        };
      }

      const result = withCurrent.value > withoutCurrent.value ? withCurrent : withoutCurrent;
      memo.set(key, result);
      return result;
    };

    return solve(0, budget, maxWeight, maxItems);
  }

  /**
   * Get costume weight (for multi-constraint optimization)
   */
  getCostumeWeight(costume) {
    // Assign weights based on costume complexity/size
    const sizeWeights = { XS: 1, S: 2, M: 3, L: 4, XL: 5, XXL: 6 };
    const categoryWeights = { 
      'Historical': 3, 
      'Fantasy': 2, 
      'Superhero': 2, 
      'Horror': 2, 
      'Sci-Fi': 2, 
      'Comedy': 1 
    };
    
    return (sizeWeights[costume.size] || 3) + (categoryWeights[costume.category] || 2);
  }
}