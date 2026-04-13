/**
 * orders.js
 * Mock order shapes mirroring the backend Order model.
 * Used for OrderConfirmation page demo / fallback.
 */

export const mockOrder = {
  id:               "ord-demo-001",
  orderNumber:      1001,
  email:            "customer@shopstore.com",
  status:           "PROCESSING",
  financialStatus:  "PAID",
  fulfillmentStatus:"UNFULFILLED",
  subtotalPrice:    "299.99",
  totalTax:         "27.00",
  totalPrice:       "326.99",
  discountCode:     null,
  discountAmount:   null,
  shippingAddress: {
    firstName: "Jane", lastName: "Doe",
    address1:  "123 Main St", city: "San Francisco",
    province:  "CA", zip: "94101", country: "US",
  },
  lineItems: [
    {
      id:           "li-001",
      title:        "Pro Wireless Headphones",
      variantTitle: "Black",
      quantity:     1,
      price:        "299.99",
      imageSrc:     "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
    },
  ],
  createdAt: new Date().toISOString(),
};