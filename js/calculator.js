/**
 * Calculator
 * ----------
 * Global object responsible for all CO2 emission calculations,
 * comparisons between transport modes, and carbon credit estimates.
 */

var Calculator = {
  /**
   * Calculate CO2 emission for a given distance and transport mode
   *
   * Formula:
   * emission = distanceKm * emissionFactor
   *
   * @param {number} distanceKm
   * @param {string} transportMode
   * @returns {number} Emission in kg CO2 (rounded to 2 decimals)
   */
  calculateEmission: function (distanceKm, transportMode) {
    var factor = CONFIG.EMISSION_FACTORS[transportMode];

    if (factor === undefined || distanceKm <= 0) return 0;

    var emission = distanceKm * factor;

    return Number(emission.toFixed(2));
  },

  /**
   * Calculate emissions for all transport modes
   * and compare each one against car emission as baseline
   *
   * percentageVsCar formula:
   * (modeEmission / carEmission) * 100
   *
   * @param {number} distanceKm
   * @returns {Array} Sorted array (lowest emission first)
   */
  calculateAllModes: function (distanceKm) {
    var results = [];
    var carEmission = this.calculateEmission(distanceKm, "car");

    for (var mode in CONFIG.EMISSION_FACTORS) {
      var emission = this.calculateEmission(distanceKm, mode);

      var percentageVsCar =
        carEmission > 0
          ? (emission / carEmission) * 100
          : 0;

      results.push({
        mode: mode,
        emission: emission,
        percentageVsCar: Number(percentageVsCar.toFixed(2))
      });
    }

    // Sort by emission (lowest first)
    results.sort(function (a, b) {
      return a.emission - b.emission;
    });

    return results;
  },

  /**
   * Calculate CO2 savings compared to a baseline emission
   *
   * savedKg = baselineEmission - emission
   * percentage = (savedKg / baselineEmission) * 100
   *
   * @param {number} emission
   * @param {number} baselineEmission
   * @returns {Object} { savedKg, percentage }
   */
  calculateSavingd: function (emission, baselineEmission) {
    if (baselineEmission <= 0) {
      return { savedKg: 0, percentage: 0 };
    }

    var savedKg = baselineEmission - emission;
    var percentage = (savedKg / baselineEmission) * 100;

    return {
      savedKg: Number(savedKg.toFixed(2)),
      percentage: Number(percentage.toFixed(2))
    };
  },

  /**
   * Calculate how many carbon credits are required
   *
   * credits = emissionKg / KG_PER_CREDIT
   *
   * @param {number} emissionKg
   * @returns {number} Credits required (rounded to 4 decimals)
   */
  calculateCarbonCredits: function (emissionKg) {
    if (emissionKg <= 0) return 0;

    var credits =
      emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;

    return Number(credits.toFixed(4));
  },

  /**
   * Estimate carbon credit price range
   *
   * min = credits * PRICE_MIN_USD
   * max = credits * PRICE_MAX_USD
   * average = (min + max) / 2
   *
   * @param {number} credits
   * @returns {Object} { min, max, average }
   */
  estimatedCreditPrice: function (credits) {
    if (credits <= 0) {
      return { min: 0, max: 0, average: 0 };
    }

    var min = credits * CONFIG.CARBON_CREDIT.PRICE_MIN_USD;
    var max = credits * CONFIG.CARBON_CREDIT.PRICE_MAX_USD;
    var average = (min + max) / 2;

    return {
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2)),
      average: Number(average.toFixed(2))
    };
  }
};
