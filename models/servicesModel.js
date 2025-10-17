const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    duration: Number,
    price: Number,
    availability: [
      {
        day: {
          type: String,
          enum: [
            "Saturday",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
        },
        start: String,
        end: String,
      },
    ],
    providerId: {
      ref: "Users",
      type: mongoose.Schema.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Services", servicesSchema);
