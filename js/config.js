/**
 * CONFIG
 * ------
 * Global configuration object for the CO2 Emission Calculator.
 *
 * Contains:
 * - Emission factors by transport mode
 * - Transport metadata (labels, icons, UI colors)
 * - Carbon credit configuration
 * - UI helper/setup methods
 */

var CONFIG = {
  /* =========================
     EMISSION FACTORS
     kg CO2 per km
  ========================= */
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96
  },

  /* =========================
     TRANSPORT MODES METADATA
  ========================= */
  TRANSPORT_MODES: {
    bicycle: {
      label: "Bicycle",
      icon: "🚲",
      color: "#10b981"
    },
    car: {
      label: "Car",
      icon: "🚗",
      color: "#3b82f6"
    },
    bus: {
      label: "Bus",
      icon: "🚌",
      color: "#f59e0b"
    },
    truck: {
      label: "Truck",
      icon: "🚚",
      color: "#ef4444"
    }
  },

  /* =========================
     CARBON CREDIT CONFIG
  ========================= */
  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_USD: 50,
    PRICE_MAX_USD: 150
  },

  /* =========================
     POPULATE CITY DATALIST
  ========================= */
  populateDatalist: function () {
    if (typeof RoutesDB === "undefined") {
      console.warn("RoutesDB not found. Cannot populate city list.");
      return;
    }

    var datalist = document.getElementById("city-list");
    if (!datalist) return;

    datalist.innerHTML = "";

    var cities = RoutesDB.getAllCities();

    cities.forEach(function (city) {
      var option = document.createElement("option");
      option.value = city;
      datalist.appendChild(option);
    });
  },

  /* =========================
     DISTANCE AUTO-FILL LOGIC
  ========================= */
  setupDistanceAutofill: function () {
    var originInput = document.getElementById("origin");
    var destinationInput = document.getElementById("destination");
    var distanceInput = document.getElementById("distance");
    var manualCheckbox = document.getElementById("manual-distance");
    var helperText = distanceInput
      ? distanceInput.nextElementSibling
      : null;

    if (
      !originInput ||
      !destinationInput ||
      !distanceInput ||
      !manualCheckbox
    ) {
      return;
    }

    var tryAutofill = function () {
      if (manualCheckbox.checked) return;

      var origin = originInput.value.trim();
      var destination = destinationInput.value.trim();

      if (!origin || !destination) return;

      var distance = RoutesDB.findDistance(origin, destination);

      if (distance !== null) {
        distanceInput.value = distance;
        distanceInput.readOnly = true;

        if (helperText) {
          helperText.textContent = "Distance found automatically ✔";
          helperText.style.color = "green";
        }
      } else {
        distanceInput.value = "";
        distanceInput.readOnly = true;

        if (helperText) {
          helperText.textContent =
            "Route not found. Please insert distance manually.";
          helperText.style.color = "#ef4444";
        }
      }
    };

    originInput.addEventListener("change", tryAutofill);
    destinationInput.addEventListener("change", tryAutofill);

    manualCheckbox.addEventListener("change", function () {
      if (manualCheckbox.checked) {
        distanceInput.readOnly = false;

        if (helperText) {
          helperText.textContent = "Manual distance entry enabled";
          helperText.style.color = "#3b82f6";
        }
      } else {
        distanceInput.readOnly = true;
        tryAutofill();
      }
    });
  }
};
