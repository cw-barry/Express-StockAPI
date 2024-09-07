'use strict';
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection');

// Import the Product model to fetch the brandId
const Product = require('./product');

// Purchase Model:
const PurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    firmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Firm',
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    amount: {
      type: Number,
      set: function () {
        return this.price * this.quantity;
      },
      default: function () {
        return this.price * this.quantity;
      },
      transform: function () {
        return this.price * this.quantity;
      },
    },

    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: false, // Make it optional here
      set: function (value) {
        // Prevent changing brandId if it is already set
        if (this.isNew || !this.brandId) {
          return value;
        }
        return this.brandId;
      },
    },
  },
  {
    collection: 'purchases',
    timestamps: true,
  }
);

// Pre-save hook to automatically set brandId from product
PurchaseSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      // Fetch the product based on productId
      const product = await Product.findById(this.productId).populate(
        'brandId'
      );

      // Automatically set the brandId from the product
      if (product && product.brandId) {
        this.brandId = product.brandId;
      } else {
        throw new Error(
          'Invalid productId or product has no associated brand.'
        );
      }

      next();
    } catch (error) {
      next(error); // Pass error to the next middleware if there's an issue
    }
  } else {
    next();
  }
});

/* ------------------------------------------------------- */
module.exports = mongoose.model('Purchase', PurchaseSchema);
