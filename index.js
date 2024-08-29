'use strict';
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const express = require('express');
const app = express();

/* ------------------------------------------------------- */
// Required Modules:

// envVariables to process.env:
require('dotenv').config();
const HOST = process.env?.HOST || '127.0.0.1';
const PORT = process.env?.PORT || 8000;

// asyncErrors to errorHandler:
require('express-async-errors');

/* ------------------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection, mongoose } = require('./src/configs/dbConnection');
dbConnection();

/* ------------------------------------------------------- */
// Middlewares:

// Accept JSON:
app.use(express.json());

// admin bro
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');

// Register the Mongoose adapter with AdminBro
AdminBro.registerAdapter(AdminBroMongoose);

// models
const {
  User,
  Category,
  Brand,
  Product,
  Firm,
  Purchase,
  Sale,
  Token,
} = require('./src/models');

// Initialize AdminBro
const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
  branding: {
    companyName: 'Clarusway',
  },

  //  Customize dashboard:
  dashboard: {
    component: AdminBro.bundle('./admin/components/CustomDashboard'),
  },
});

// Build the admin router
const adminRouter = AdminBroExpress.buildRouter(adminBro);

// Use the admin router in your Express app
app.use(adminBro.options.rootPath, adminRouter);

// Call static uploadFile:
app.use('/upload', express.static('./upload'));

// Check Authentication:
app.use(require('./src/middlewares/authentication'));

// Run Logger:
app.use(require('./src/middlewares/logger'));

// res.getModelList():
app.use(require('./src/middlewares/findSearchSortPage'));

/* ------------------------------------------------------- */
// Routes:

// HomePath:
app.all('/', (req, res) => {
  res.send({
    error: false,
    message: 'Welcome to Stock Management API',
    documents: {
      swagger: '/documents/swagger',
      redoc: '/documents/redoc',
      json: '/documents/json',
    },
    user: req.user,
  });
});

// Routes:
app.use(require('./src/routes'));

/* ------------------------------------------------------- */

// errorHandler:
app.use(require('./src/middlewares/errorHandler'));

// RUN SERVER:
app.listen(PORT, HOST, () => console.log(`http://${HOST}:${PORT}`));

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')() // !!! It clear database.
