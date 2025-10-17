const mongoose = require("mongoose");

const appointmentsSchem = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    providerId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    serviceId: {
      type: mongoose.Schema.ObjectId,
      ref: "Services",
    },
    startTime: Date,
    endTime: Date,
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

appointmentsSchem.pre(/^find/, function (next) {
  this.populate({ path: "providerId", select: "name -_id" });
  this.populate({ path: "userId", select: "name email phone -_id" });
  this.populate({ path: "serviceId", select: "title -_id" });
  next();
});
module.exports = mongoose.model("Appointments", appointmentsSchem);
