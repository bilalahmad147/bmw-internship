const express = require("express");
const router = express.Router();
const Car = require("../models/Car");

// Get all cars
router.get("/", async (req, res) => {
  try {
    const { filterModel } = req.query;

    // Parse the filter model
    const parsedFilters = filterModel ? JSON.parse(filterModel) : {};
    console.log("Parsed Filters:", parsedFilters);

    const query = {};

    // Build the query based on parsed filters
    Object.keys(parsedFilters).forEach((field) => {
      const filterDetails = parsedFilters[field];
      const { filterType, operator, conditions } = filterDetails;

      // Handle compound conditions (AND/OR)
      if (conditions && conditions.length > 0) {
        const conditionOperator = operator === "AND" ? "$and" : "$or";
        const mongoConditions = conditions.map((condition) => {
          const {
            type,
            filter,
            filterTo,
            filterType: conditionFilterType,
          } = condition;

          if (conditionFilterType === "text" && filter) {
            // Escape special regex characters
            const escapedFilter = filter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            switch (type) {
              case "contains":
                return {
                  [field]: { $regex: escapedFilter.trim(), $options: "i" },
                };
              case "equals":
                return { [field]: filter.trim() };
              case "startsWith":
                return {
                  [field]: {
                    $regex: `^${escapedFilter.trim()}`,
                    $options: "i",
                  },
                };
              case "endsWith":
                return {
                  [field]: {
                    $regex: `${escapedFilter.trim()}\\s*$`,
                    $options: "i",
                  },
                };
              default:
                return {};
            }
          }

          if (
            conditionFilterType === "number" &&
            (filter !== undefined || type === "blank")
          ) {
            switch (type) {
              case "equals":
                return { [field]: Number(filter) };
              case "notEquals":
                return { [field]: { $ne: Number(filter) } };
              case "greaterThan":
                return { [field]: { $gt: Number(filter) } };
              case "greaterThanOrEqual":
                return { [field]: { $gte: Number(filter) } };
              case "lessThan":
                return { [field]: { $lt: Number(filter) } };
              case "lessThanOrEqual":
                return { [field]: { $lte: Number(filter) } };
              case "between":
                return {
                  [field]: {
                    $gte: Number(filter),
                    $lte: Number(filterTo),
                  },
                };
              case "blank":
                return { [field]: { $exists: false } };
              default:
                return {};
            }
          }
          return {};
        });

        query[conditionOperator] = mongoConditions;
        return;
      }

      // Handle single condition (existing code)
      const { type, filter, filterTo } = filterDetails;

      if (filterType === "text" && filter) {
        // Escape special regex characters
        const escapedFilter = filter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        switch (type) {
          case "contains":
            query[field] = { $regex: escapedFilter.trim(), $options: "i" };
            break;
          case "equals":
            query[field] = filter.trim();
            break;
          case "startsWith":
            query[field] = {
              $regex: `^${escapedFilter.trim()}`,
              $options: "i",
            };
            break;
          case "endsWith":
            // Match the end of the string ignoring trailing spaces
            query[field] = {
              $regex: `${escapedFilter.trim()}\\s*$`,
              $options: "i",
            };
            break;
        }
      }

      if (
        filterType === "number" &&
        (filter !== undefined || type === "blank")
      ) {
        switch (type) {
          case "equals":
            query[field] = Number(filter);
            break;
          case "notEquals":
            query[field] = { $ne: Number(filter) };
            break;
          case "greaterThan":
            query[field] = { $gt: Number(filter) };
            break;
          case "greaterThanOrEqual":
            query[field] = { $gte: Number(filter) };
            break;
          case "lessThan":
            query[field] = { $lt: Number(filter) };
            break;
          case "lessThanOrEqual":
            query[field] = { $lte: Number(filter) };
            break;
          case "between":
            query[field] = {
              $gte: Number(filter),
              $lte: Number(filterTo),
            };
            break;
          case "blank":
            query[field] = { $exists: false };
            break;
        }
      }
    });

    // Add these debug logs
    console.log("Filter Details:", parsedFilters);
    console.log("Final Query:", JSON.stringify(query, null, 2));

    // Fetch data using the constructed query
    const cars = await Car.find(query).exec();
    console.log("Found cars:", cars.length);

    if (!cars || cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cars match the filter criteria.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cars fetched successfully.",
      data: cars,
    });
  } catch (err) {
    console.error("Error fetching cars:", err.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching cars.",
      error: err.message,
    });
  }
});


// Add a new car
router.post("/", async (req, res) => {
  const {
    Brand,
    Model,
    AccelSec,
    TopSpeed_KmH,
    Range_Km,
    Efficiency_WhKm,
    FastCharge_KmH,
    RapidCharge,
    PowerTrain,
    PlugType,
    BodyStyle,
    Segment,
    Seats,
    PriceEuro,
    Date,
  } = req.body;

  try {
    const newCar = new Car({
      Brand,
      Model,
      AccelSec,
      TopSpeed_KmH,
      Range_Km,
      Efficiency_WhKm,
      FastCharge_KmH,
      RapidCharge,
      PowerTrain,
      PlugType,
      BodyStyle,
      Segment,
      Seats,
      PriceEuro,
      Date,
    });

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(500).json({ error: "Failed to add car" });
  }
});

// Delete a car by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete car" });
  }
});

// Get a car by ID
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found with the provided ID.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Car fetched successfully.",
      data: car,
    });
  } catch (err) {
    console.error("Error fetching car:", err.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the car.",
      error: err.message,
    });
  }
});

module.exports = router;
