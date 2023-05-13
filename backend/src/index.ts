// Use node.js rest api to create a CRUD application for a single entity of your choice.
// The entity should have at least 5 attributes, not counting the ID. 
// You do not need any validations.

// The application should have the following endpoints:
// GET /api/<entity> - returns all entities
// GET /api/<entity>/:id - returns a single entity by id
// POST /api/<entity> - creates a new entity
// PUT /api/<entity>/:id - updates an entity
// DELETE /api/<entity>/:id - deletes an entity

// The application should have the following functionality:
// Use a json file to store the data
// Use a class to represent the entity
// Use a class that implements a repository pattern to access the data
// Use a class that implements a service pattern to handle the business logic

// The application should have the following additional requirements:
// Use async/await
// Use try/catch/throw
// Use typescript

// import { runTests } from './tests';

// runTests();

import setupRoutes from './routes';
import express from 'express';
import setupSwagger from './swagger';
import PGService from './pgService';

const app = express();
//     ^?

// setup CORS
const cors = require('cors');
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'sessiontoken']
}));

const port = 3000;
app.use(express.json());

require('dotenv').config();

const service = new PGService();

setupRoutes(app, service);

setupSwagger(app, port);

// start the server
app.listen(port, () => {
    console.log(`Box Storage app listening at http://localhost:${port}`);
});
