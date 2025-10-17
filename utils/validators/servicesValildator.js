const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatormiddelware");

exports.UpdateServiceValidtor = [
  check("id")
    .isMongoId()
    .withMessage("invalid id format")
    .custom((val, { req }) =>
      Service.findById(val).then((service) => {
        if (!service) {
          return Promise.reject(new Error(`there's no id for ${val}`));
        }

        if (service.providerId._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`you are not allowed to perform this action`)
          );
        }
        return true;
      })
    ),
  validatorMiddleware,
];

exports.DeleteServiceValidtor = [
  check("id")
    .isMongoId()
    .withMessage("invalid id format")
    .custom((val, { req }) => {
      if (req.user.role === "provider") {
        Service.findById(val).then((service) => {
          if (!service) {
            return Promise.reject(new Error(`there's no id for ${val}`));
          }

          if (service.providerId._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error(`you are not allowed to perform this action`)
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
