/**
 * Recommendation System using Collaborative and Content-based Filtering
 */

export class RecommendationEngine {
  constructor() {
    this.userPreferences = new Map();
    this.itemSimilarity = new Map();
  }

  /**
   * Content-based filtering - recommend similar costumes
   */
  getContentBasedRecommendations(costume, allCostumes, limit = 5) {
    const similarities = allCostumes
      .filter(c => c.id !== costume.id)
      .map(c => ({
        costume: c,
        similarity: this.calculateContentSimilarity(costume, c)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return similarities.map(s => s.costume);
  }

  /**
   * Calculate similarity between two costumes based on content
   */
  calculateContentSimilarity(costume1, costume2) {
    let similarity = 0;

    // Category similarity (highest weight)
    if (costume1.category === costume2.category) {
      similarity += 0.4;
    }

    // Size similarity
    if (costume1.size === costume2.size) {
      similarity += 0.2;
    }

    // Price similarity (within 20% range)
    const priceDiff = Math.abs(costume1.price - costume2.price);
    const avgPrice = (costume1.price + costume2.price) / 2;
    if (priceDiff / avgPrice <= 0.2) {
      similarity += 0.2;
    }

    // Condition similarity
    if (costume1.condition === costume2.condition) {
      similarity += 0.1;
    }

    // Description similarity (basic keyword matching)
    const desc1Words = costume1.description.toLowerCase().split(' ');
    const desc2Words = costume2.description.toLowerCase().split(' ');
    const commonWords = desc1Words.filter(word => desc2Words.includes(word));
    similarity += (commonWords.length / Math.max(desc1Words.length, desc2Words.length)) * 0.1;

    return similarity;
  }

  /**
   * Collaborative filtering based on user rental history
   */
  getCollaborativeRecommendations(userId, userRentals, allRentals, allCostumes, limit = 5) {
    // Find users with similar rental patterns
    const userCostumes = userRentals
      .filter(r => r.userId === userId)
      .map(r => r.costumeId);

    if (userCostumes.length === 0) {
      return this.getPopularRecommendations(allRentals, allCostumes, limit);
    }

    const similarUsers = this.findSimilarUsers(userId, userCostumes, allRentals);
    
    // Get costumes rented by similar users but not by current user
    const recommendations = new Map();
    
    similarUsers.forEach(({ userId: similarUserId, similarity }) => {
      const similarUserRentals = allRentals
        .filter(r => r.userId === similarUserId && !userCostumes.includes(r.costumeId))
        .map(r => r.costumeId);

      similarUserRentals.forEach(costumeId => {
        const current = recommendations.get(costumeId) || 0;
        recommendations.set(costumeId, current + similarity);
      });
    });

    // Sort by recommendation score and return costumes
    const sortedRecommendations = Array.from(recommendations.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([costumeId]) => allCostumes.find(c => c.id === costumeId))
      .filter(Boolean);

    return sortedRecommendations;
  }

  /**
   * Find users with similar rental patterns
   */
  findSimilarUsers(userId, userCostumes, allRentals) {
    const userSimilarities = new Map();

    // Group rentals by user
    const rentalsByUser = new Map();
    allRentals.forEach(rental => {
      if (!rentalsByUser.has(rental.userId)) {
        rentalsByUser.set(rental.userId, []);
      }
      rentalsByUser.get(rental.userId).push(rental.costumeId);
    });

    // Calculate Jaccard similarity with other users
    rentalsByUser.forEach((otherUserCostumes, otherUserId) => {
      if (otherUserId === userId) return;

      const intersection = userCostumes.filter(id => otherUserCostumes.includes(id));
      const union = [...new Set([...userCostumes, ...otherUserCostumes])];
      const similarity = intersection.length / union.length;

      if (similarity > 0.1) { // Minimum similarity threshold
        userSimilarities.set(otherUserId, similarity);
      }
    });

    return Array.from(userSimilarities.entries())
      .map(([userId, similarity]) => ({ userId, similarity }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10); // Top 10 similar users
  }

  /**
   * Get popular recommendations based on rental frequency
   */
  getPopularRecommendations(allRentals, allCostumes, limit = 5) {
    const rentalCounts = new Map();
    
    allRentals.forEach(rental => {
      const count = rentalCounts.get(rental.costumeId) || 0;
      rentalCounts.set(rental.costumeId, count + 1);
    });

    return Array.from(rentalCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([costumeId]) => allCostumes.find(c => c.id === costumeId))
      .filter(Boolean);
  }

  /**
   * Apriori algorithm for frequent itemset mining (combo rentals)
   */
  findFrequentCombos(allRentals, minSupport = 0.1) {
    // Group rentals by user and time period
    const userSessions = this.groupRentalSessions(allRentals);
    
    // Find frequent 2-itemsets
    const itemPairs = new Map();
    
    userSessions.forEach(session => {
      if (session.length < 2) return;
      
      for (let i = 0; i < session.length; i++) {
        for (let j = i + 1; j < session.length; j++) {
          const pair = [session[i], session[j]].sort().join(',');
          itemPairs.set(pair, (itemPairs.get(pair) || 0) + 1);
        }
      }
    });

    const totalSessions = userSessions.length;
    const frequentPairs = Array.from(itemPairs.entries())
      .filter(([pair, count]) => count / totalSessions >= minSupport)
      .map(([pair, count]) => ({
        items: pair.split(','),
        support: count / totalSessions,
        count
      }))
      .sort((a, b) => b.support - a.support);

    return frequentPairs;
  }

  /**
   * Group rentals into sessions (same user, overlapping time periods)
   */
  groupRentalSessions(allRentals) {
    const userRentals = new Map();
    
    // Group by user
    allRentals.forEach(rental => {
      if (!userRentals.has(rental.userId)) {
        userRentals.set(rental.userId, []);
      }
      userRentals.get(rental.userId).push(rental);
    });

    const sessions = [];
    
    userRentals.forEach(rentals => {
      // Sort by start date
      rentals.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      
      let currentSession = [];
      let sessionEndDate = null;
      
      rentals.forEach(rental => {
        const rentalStart = new Date(rental.startDate);
        
        // If rental starts within 7 days of session end, add to current session
        if (sessionEndDate && rentalStart <= new Date(sessionEndDate.getTime() + 7 * 24 * 60 * 60 * 1000)) {
          currentSession.push(rental.costumeId);
          sessionEndDate = new Date(Math.max(sessionEndDate, new Date(rental.endDate)));
        } else {
          // Start new session
          if (currentSession.length > 0) {
            sessions.push([...currentSession]);
          }
          currentSession = [rental.costumeId];
          sessionEndDate = new Date(rental.endDate);
        }
      });
      
      if (currentSession.length > 0) {
        sessions.push(currentSession);
      }
    });

    return sessions;
  }
}