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

import { runTests } from './tests';

runTests();



import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

import { Box, Wrapper, Supplier, WrapperBoxCombo, AverageWrapperLength } from "./entities";
import { BoxRepository, WrapperRepository, SupplierRepository, WrapperBoxComboRepository } from './repos';

// import cors from 'cors';

const app = express();
//     ^?

// // setup CORS
// const cors = require('cors');
// app.use(cors({
//     origin: '*'
// }));

const port = 80;
app.use(express.json());

const filePath = join(__dirname, 'data.json');

import { MongoClient } from 'mongodb';
import { ObjectId } from "mongodb";
import * as dotenv from "dotenv";
import * as mongoDB from "mongodb";
import { Service } from './service';
import { exit } from 'process';


var collections: { 
    boxes?: mongoDB.Collection,
    wrappers?: mongoDB.Collection,
    suppliers?: mongoDB.Collection 
    combos?: mongoDB.Collection
} = {}

var repositories: {
    boxes?: BoxRepository,
    wrappers?: WrapperRepository,
    suppliers?: SupplierRepository
    combos?: WrapperBoxComboRepository
} = {}

function connectToDatabase() { 
    require('dotenv').config();

    console.log("Created dotenv config");

    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = process.env.DB_CONN_STRING;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    client.connect();
    console.log("Connected to MongoDB");

    const database_name = process.env.DB_NAME;
    const box_collection_name = process.env.DB_COLLECTION_BOXES;
    const wrapper_collection_name = process.env.DB_COLLECTION_WRAPPERS;
    const supplier_collection_name = process.env.DB_COLLECTION_SUPPLIERS;
    const combo_collection_name = process.env.DB_COLLECTION_COMBOS;

    if (!box_collection_name || !wrapper_collection_name || !supplier_collection_name || !combo_collection_name) {
        // console.log("Error: Missing collection name in .env file");
        throw new Error("Error: Missing collection name in .env file");
    }
    
    const database: mongoDB.Db = client.db(database_name);

    const boxCollection = database.collection(box_collection_name);
    const wrapperCollection = database.collection(wrapper_collection_name);
    const supplierCollection = database.collection(supplier_collection_name);
    const comboCollection = database.collection(combo_collection_name);

    collections.boxes = boxCollection;
    collections.wrappers = wrapperCollection;
    collections.suppliers = supplierCollection;
    collections.combos = comboCollection;
    
    console.log("Connected to collections");

    repositories.boxes = new BoxRepository(boxCollection);
    repositories.wrappers = new WrapperRepository(wrapperCollection);
    repositories.suppliers = new SupplierRepository(supplierCollection);
    repositories.combos = new WrapperBoxComboRepository(comboCollection);
}

connectToDatabase();
const service = new Service(repositories.boxes, repositories.wrappers, repositories.suppliers, repositories.combos);

import setupRoutes from './routes';

setupRoutes(app, service);

import setupSwagger from './swagger';

setupSwagger(app, port);

// start the server
app.listen(port, () => {
    console.log(`Box Storage app listening at http://localhost:${port}`);
});
