const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, require: true, ref: "Users" },
  tables: [
    { table: { type: Schema.Types.ObjectId, require: true, ref: "Tables" } },
  ],
  depositAmount: { type: mongoose.Types.Decimal128, require: true },
  arrivalTime: { type: Date, require: true },
  isCancelled: { type: Boolean, require: true },
});

module.exports = mongoose.model("Reservations", reservationSchema);
