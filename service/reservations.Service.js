const _Table = require("../models/table.Model");
const _Reservation = require("../models/reservation.Model");
const createError = require("http-errors");

function getCosts(value) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString());
  }
  return value;
}

var that = (module.exports = {
  addReservation: async ({ customerId, tables, arrivalTime }) => {
    return new Promise(async (resolve, reject) => {
      var depositPrice = tables[0].depositAmount.$numberDecimal;
      await _Reservation
        .create({
          customer: customerId,
          tables: tables,
          depositAmount: depositPrice,
          arrivalTime: arrivalTime,
        })
        .then(async (reservation) => {
          await _Table.findOneAndUpdate(
            { _id: tables[0]._id },
            { $set: { isAvailable: false } }
          );
          resolve(reservation);
        })
        .catch((error) =>
          reject(new createError(404, "Cannot Make Reservation"))
        );
    });
  },
  getAllReservation: async () => {
    return new Promise(async (resolve, reject) => {
      await _Reservation
        .find()
        .populate("customer", {
          phone: 1,
          fullName: 1,
          _id: 0,
        })
        .populate("tables.table", {
          tableNumber: 1,
          capacity: 1,
          timeRangeType: 1,
          _id: 0,
        })
        .exec()
        .then((reservation) => resolve(reservation))
        .catch((error) => reject(new createError(404, error)));
    });
  },
  getReservationByUser: async ({ customerId }) => {
    return new Promise(async (resolve, reject) => {
      await _Reservation
        .find({
          customer: customerId,
        })
        .populate("customer", {
          phone: 1,
          fullName: 1,
          _id: 0,
        })
        .populate("tables.table", {
          tableNumber: 1,
          capacity: 1,
          timeRangeType: 1,
          _id: 0,
        })
        .exec()
        .then((reservation) => resolve(reservation))
        .catch((error) => reject(new createError(404, error)));
    });
  },
});
