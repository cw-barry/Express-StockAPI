'use strict';
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require('express').Router();
/* ------------------------------------------------------- */
// routes/brand:

const brand = require('../controllers/brand');
const permissions = require('../middlewares/permissions');

// URL: /brands

router
  .route('/')
  .get(permissions.isStaff, brand.list)
  .post(permissions.isAdmin, brand.create);

router
  .route('/:id')
  .get(permissions.isStaff, brand.read)
  .put(permissions.isAdmin, brand.update)
  .patch(permissions.isAdmin, brand.update)
  .delete(permissions.isAdmin, brand.delete);

/* ------------------------------------------------------- */
module.exports = router;
