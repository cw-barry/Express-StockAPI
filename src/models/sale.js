'use strict';
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection');
const Product = require('./product');
/* ------------------------------------------------------- */
// Sale Model:

const SaleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
  },
  {
    collection: 'Sales',
    timestamps: true,
  }
);

/* ------------------------------------------------------- */
// https://mongoosejs.com/docs/middleware.html

// pre('init') -> Ekrana veriyi vermeden önce veriyi (çıktıyı) manipule edebiliriz:
// middleware değil, next gerek yok:
SaleSchema.pre('init', function (document) {
  // console.log(document)
  document.extraField = 'Cohort 15';
  document.__v = undefined;
  // toLocaleDateString:
  // https://www.w3schools.com/jsref/jsref_tolocalestring.asp
  document.createdAtStr = document.createdAt.toLocaleString('tr-tr', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });
  document.updatedAtStr = document.updatedAt.toLocaleString('tr-tr', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });
  // document.createdAt = undefined
  // document.updatedAt = undefined
});

// Pre-save hook to automatically set brandId from product
SaleSchema.pre('save', async function (next) {
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
module.exports = mongoose.model('Sale', SaleSchema);
