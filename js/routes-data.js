/**
 * RoutesDB
 * --------
 * Global in-memory database of predefined routes between major
 * Canadian and U.S. cities, used to auto-calculate distances.
 *
 * Structure:
 * - routes: Array of route objects
 *   - origin: "City, State/Province"
 *   - destination: "City, State/Province"
 *   - distanceKm: Number (distance in kilometers)
 *
 * Methods:
 * - getAllCities(): returns unique, sorted list of all cities
 * - findDistance(origin, destination): returns distance in km or null
 */

var RoutesDB = {
  routes: [
    // ===== CANADA: CAPITAL & MAJOR CITY ROUTES =====
    { origin: "Toronto, ON", destination: "Ottawa, ON", distanceKm: 451 },
    { origin: "Ottawa, ON", destination: "Montreal, QC", distanceKm: 199 },
    { origin: "Toronto, ON", destination: "Montreal, QC", distanceKm: 541 },
    { origin: "Edmonton, AB", destination: "Ottawa, ON", distanceKm: 3389 },
    { origin: "Vancouver, BC", destination: "Ottawa, ON", distanceKm: 4450 },
    { origin: "Calgary, AB", destination: "Edmonton, AB", distanceKm: 299 },
    { origin: "Vancouver, BC", destination: "Calgary, AB", distanceKm: 970 },
    { origin: "Winnipeg, MB", destination: "Toronto, ON", distanceKm: 2225 },
    { origin: "Winnipeg, MB", destination: "Regina, SK", distanceKm: 575 },
    { origin: "Regina, SK", destination: "Saskatoon, SK", distanceKm: 262 },
    { origin: "Halifax, NS", destination: "Moncton, NB", distanceKm: 260 },
    { origin: "Halifax, NS", destination: "St. John's, NL", distanceKm: 1810 },
    { origin: "Quebec City, QC", destination: "Montreal, QC", distanceKm: 252 },
    { origin: "Quebec City, QC", destination: "Ottawa, ON", distanceKm: 445 },
    { origin: "Hamilton, ON", destination: "Toronto, ON", distanceKm: 68 },

    // ===== CANADA ↔ USA ROUTES =====
    { origin: "Toronto, ON", destination: "New York, NY", distanceKm: 790 },
    { origin: "Toronto, ON", destination: "Chicago, IL", distanceKm: 701 },
    { origin: "Vancouver, BC", destination: "Seattle, WA", distanceKm: 230 },
    { origin: "Montreal, QC", destination: "Boston, MA", distanceKm: 500 },
    { origin: "Vancouver, BC", destination: "San Francisco, CA", distanceKm: 1275 },
    { origin: "Calgary, AB", destination: "Denver, CO", distanceKm: 1350 },
    { origin: "Windsor, ON", destination: "Detroit, MI", distanceKm: 11 },

    // ===== USA: MAJOR CITY ROUTES =====
    { origin: "New York, NY", destination: "Washington, DC", distanceKm: 362 },
    { origin: "Washington, DC", destination: "Boston, MA", distanceKm: 634 },
    { origin: "Los Angeles, CA", destination: "San Francisco, CA", distanceKm: 615 },
    { origin: "Los Angeles, CA", destination: "Las Vegas, NV", distanceKm: 435 },
    { origin: "San Francisco, CA", destination: "Seattle, WA", distanceKm: 1306 },
    { origin: "Chicago, IL", destination: "Detroit, MI", distanceKm: 454 },
    { origin: "Chicago, IL", destination: "Minneapolis, MN", distanceKm: 661 },
    { origin: "Dallas, TX", destination: "Houston, TX", distanceKm: 385 },
    { origin: "Atlanta, GA", destination: "Miami, FL", distanceKm: 1065 },
    { origin: "Denver, CO", destination: "Salt Lake City, UT", distanceKm: 830 },
    { origin: "Phoenix, AZ", destination: "Las Vegas, NV", distanceKm: 475 },
    { origin: "San Diego, CA", destination: "Los Angeles, CA", distanceKm: 195 }
  ],

  /**
   * Returns a unique, alphabetically sorted array of all cities
   * found in origin and destination fields.
   */
  getAllCities: function () {
    var cities = [];

    this.routes.forEach(function (route) {
      cities.push(route.origin);
      cities.push(route.destination);
    });

    return Array.from(new Set(cities)).sort();
  },

  /**
   * Finds the distance between two cities.
   * - Searches in both directions (A → B and B → A)
   * - Normalizes input by trimming and converting to lowercase
   *
   * @param {string} origin
   * @param {string} destination
   * @returns {number|null} Distance in km or null if not found
   */
  findDistance: function (origin, destination) {
    if (!origin || !destination) return null;

    var o = origin.trim().toLowerCase();
    var d = destination.trim().toLowerCase();

    for (var i = 0; i < this.routes.length; i++) {
      var route = this.routes[i];

      var rOrigin = route.origin.toLowerCase();
      var rDest = route.destination.toLowerCase();

      if (
        (rOrigin === o && rDest === d) ||
        (rOrigin === d && rDest === o)
      ) {
        return route.distanceKm;
      }
    }

    return null;
  }
};
