/**
 * constants.js
 * App-wide constants. Never hardcode these values elsewhere.
 */

export const ORDER_STATUS = {
  PENDING:    "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED:    "SHIPPED",
  DELIVERED:  "DELIVERED",
  CANCELLED:  "CANCELLED",
  REFUNDED:   "REFUNDED",
};

export const PAYMENT_STATUS = {
  PENDING:    "PENDING",
  PAID:       "PAID",
  FAILED:     "FAILED",
  REFUNDED:   "REFUNDED",
};

export const FULFILLMENT_STATUS = {
  UNFULFILLED: "UNFULFILLED",
  PARTIAL:     "PARTIAL",
  FULFILLED:   "FULFILLED",
};

export const PRODUCT_STATUS = {
  ACTIVE:   "ACTIVE",
  DRAFT:    "DRAFT",
  ARCHIVED: "ARCHIVED",
};

export const USER_ROLE = {
  CUSTOMER: "CUSTOMER",
  ADMIN:    "ADMIN",
};

export const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT:     100,
};

export const PROMO_CODES = {
  SAVE10: { discount: 0.10, type: "percentage", label: "10% off" },
  SAVE20: { discount: 0.20, type: "percentage", label: "20% off" },
  FLAT50: { discount: 50,   type: "fixed",      label: "$50 off" },
};

export const HTTP_STATUS = {
  OK:                  200,
  CREATED:             201,
  NO_CONTENT:          204,
  BAD_REQUEST:         400,
  UNAUTHORIZED:        401,
  FORBIDDEN:           403,
  NOT_FOUND:           404,
  CONFLICT:            409,
  UNPROCESSABLE:       422,
  INTERNAL_ERROR:      500,
};