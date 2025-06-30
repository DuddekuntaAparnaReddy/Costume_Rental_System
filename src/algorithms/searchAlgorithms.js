/**
 * Search Algorithms for Fast Item Lookup
 * Includes Binary Search, Trie for autocomplete, and advanced filtering
 */

export class SearchEngine {
  constructor() {
    this.trie = new TrieNode();
    this.sortedCostumes = [];
  }

  /**
   * Binary Search on sorted costume data
   */
  binarySearchByName(costumes, searchName) {
    const sorted = [...costumes].sort((a, b) => a.name.localeCompare(b.name));
    let left = 0;
    let right = sorted.length - 1;
    const results = [];

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midName = sorted[mid].name.toLowerCase();
      const search = searchName.toLowerCase();

      if (midName.includes(search)) {
        results.push(sorted[mid]);
        
        // Search left and right for more matches
        let leftIdx = mid - 1;
        while (leftIdx >= 0 && sorted[leftIdx].name.toLowerCase().includes(search)) {
          results.unshift(sorted[leftIdx]);
          leftIdx--;
        }
        
        let rightIdx = mid + 1;
        while (rightIdx < sorted.length && sorted[rightIdx].name.toLowerCase().includes(search)) {
          results.push(sorted[rightIdx]);
          rightIdx++;
        }
        
        break;
      } else if (midName < search) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return results;
  }

  /**
   * Build Trie for autocomplete functionality
   */
  buildTrie(costumes) {
    this.trie = new TrieNode();
    
    costumes.forEach(costume => {
      this.insertIntoTrie(costume.name.toLowerCase(), costume);
      this.insertIntoTrie(costume.category.toLowerCase(), costume);
      costume.description.toLowerCase().split(' ').forEach(word => {
        if (word.length > 2) {
          this.insertIntoTrie(word, costume);
        }
      });
    });
  }

  insertIntoTrie(word, costume) {
    let current = this.trie;
    
    for (const char of word) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
      current.costumes.add(costume);
    }
    
    current.isEndOfWord = true;
  }

  /**
   * Get autocomplete suggestions using Trie
   */
  getAutocompleteSuggestions(prefix, limit = 5) {
    const suggestions = new Set();
    let current = this.trie;
    
    // Navigate to prefix
    for (const char of prefix.toLowerCase()) {
      if (!current.children[char]) {
        return [];
      }
      current = current.children[char];
    }
    
    // Collect all costumes from this node
    const costumes = Array.from(current.costumes);
    
    return costumes
      .slice(0, limit)
      .map(costume => ({
        text: costume.name,
        category: costume.category,
        costume: costume
      }));
  }

  /**
   * Advanced regex-based search with multiple filters
   */
  advancedSearch(costumes, filters) {
    return costumes.filter(costume => {
      // Text search with regex
      if (filters.searchText) {
        const regex = new RegExp(filters.searchText, 'gi');
        const textMatch = regex.test(costume.name) || 
                         regex.test(costume.description) || 
                         regex.test(costume.category);
        if (!textMatch) return false;
      }

      // Category filter
      if (filters.category && costume.category !== filters.category) {
        return false;
      }

      // Size filter
      if (filters.size && costume.size !== filters.size) {
        return false;
      }

      // Price range filter
      if (filters.minPrice && costume.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && costume.price > filters.maxPrice) {
        return false;
      }

      // Availability filter
      if (filters.availableOnly && !costume.available) {
        return false;
      }

      // Condition filter
      if (filters.condition && costume.condition !== filters.condition) {
        return false;
      }

      return true;
    });
  }

  /**
   * Fuzzy search using Levenshtein distance
   */
  fuzzySearch(costumes, searchTerm, threshold = 2) {
    return costumes.filter(costume => {
      const nameDistance = this.levenshteinDistance(
        costume.name.toLowerCase(), 
        searchTerm.toLowerCase()
      );
      const categoryDistance = this.levenshteinDistance(
        costume.category.toLowerCase(), 
        searchTerm.toLowerCase()
      );
      
      return Math.min(nameDistance, categoryDistance) <= threshold;
    });
  }

  levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null)
    );

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }
}

class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.costumes = new Set();
  }
}