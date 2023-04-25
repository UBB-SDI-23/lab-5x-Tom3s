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
import { join } from 'path';

import { Box, Wrapper, Supplier, WrapperBoxCombo, AverageWrapperLength } from "./entities";
import { BoxRepository, WrapperRepository, SupplierRepository, WrapperBoxComboRepository } from './repos';

// import cors from 'cors';

const app = express();

const cors = require('cors');

app.use(cors({
    origin: '*'
}));

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

// REST API

// GET /api/boxes - returns all boxes
app.get('/api/boxes', async (req, res) => {
    res.send(await service.getAllBoxes());
});

// GET /api/boxes/:id - returns a single box by id
app.get('/api/boxes/:id', async (req, res) => {
    const id = String(req.params.id);
    const box = await service.getBoxById(id);
    if (box) {
        res.send(box);
    } else {
        res.sendStatus(404);
    }
});

// POST /api/boxes - creates a new box
app.post('/api/boxes', (req, res) => {
    if (req.body instanceof Array) {
        var boxes = (req.body) as Box[];
        try {
            service.addBoxes(boxes);
            res.sendStatus(201);
        } catch (error) {
            res.sendStatus(400);
        }
    } else {
        var box = (req.body) as Box;

        try {
            service.addBox(box);
            res.sendStatus(201);
        } catch (error) {
            res.sendStatus(400);
        }
    }
});

// PUT /api/boxes/:id - updates a box
app.put('/api/boxes/:id', (req, res) => {
    const id = String(req.params.id);

    var box = (req.body) as Box;

    box._id = new ObjectId(id);
    
    try {
        service.updateBox(box);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    }
});

// DELETE /api/boxes/:id - deletes a box
app.delete('/api/boxes/:id', (req, res) => {
    const id = String(req.params.id);
    try {
        service.deleteBox(id);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    }
});

// GET /api/wrappers - returns all wrappers
app.get('/api/wrappers', async (req, res) => {
    res.send(await service.getAllWrappers());
});

// GET /api/wrappers/:id - returns a single wrapper by id
app.get('/api/wrappers/:id', async (req, res) => {
    const id = String(req.params.id);
    const wrapper = await service.getWrapperById(id);
    if (wrapper) {
        res.send(wrapper);
    } else {
        res.sendStatus(404);
    }
});

// POST /api/wrappers - creates a new wrapper
app.post('/api/wrappers', (req, res) => {
    var wrapper = (req.body) as Wrapper;

    try {
        service.addWrapper(wrapper);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);
    }
});

// PUT /api/wrappers/:id - updates a wrapper
app.put('/api/wrappers/:id', (req, res) => {
    const id = Number(req.params.id);
    var wrapper = (req.body) as Wrapper;

    wrapper._id = new ObjectId(id);

    try {
        service.updateWrapper(wrapper);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    }
});

// DELETE /api/wrappers/:id - deletes a wrapper
app.delete('/api/wrappers/:id', (req, res) => {
    const id = String(req.params.id);
    try {
        service.deleteWrapper(id);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    }
});

// GET /api/suppliers - returns all suppliers
app.get('/api/suppliers', async (req, res) => {
    res.send(await service.getAllSuppliers());
});

// GET /api/suppliers/:id - returns a single supplier by id
app.get('/api/suppliers/:id', async (req, res) => {
    const id = String(req.params.id);
    const supplier = await service.getSupplierById(id);
    if (supplier) {
        res.send(supplier);
    } else {
        res.sendStatus(404);
    }
});

// POST /api/suppliers - creates a new supplier
app.post('/api/suppliers', (req, res) => {
    var supplier = (req.body) as Supplier;

    if (!supplier.wrappers) {
        supplier.wrappers = new Array<string>();
    }

    try {
        service.addSupplier(supplier);
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(400);
    }
});

// PUT /api/suppliers/:id/:wrapperId - adds a wrapper to a supplier
app.put('/api/suppliers/:id/:wrapperId', (req, res) => {
    const id = String(req.params.id);
    const wrapperId = String(req.params.wrapperId);

    try {
        service.addWrapperToSupplier(id, wrapperId);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    }
});


// PUT /api/suppliers
app.put('/api/suppliers/:id', (req, res) => {
    const id = String(req.params.id);
    var supplier = (req.body) as Supplier;

    supplier._id = new ObjectId(id);

    service.updateSupplier(supplier);
    res.sendStatus(200);
});

// DELETE /api/suppliers/:id - deletes a supplier
app.delete('/api/suppliers/:id', (req, res) => {
    const id = String(req.params.id);
    try {
        service.deleteSupplier(id);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    }
});

// GET /api/boxes/filter/:size - returns boxes larger than the given size
app.get('/api/boxes/filter/:size', async (req, res) => {
    const size = Number(req.params.size);
    const boxes = await service.getBoxesLargerThan(size);
    res.send(boxes);
});

// GET /api/combos - returns all combos
app.get('/api/combos', async (req, res) => {
    res.send(await service.getAllCombos());
});

// GET /api/combos/:id - returns a single combo by id
app.get('/api/combos/:id', async (req, res) => {
    const id = String(req.params.id);
    const combo = await service.getComboById(id);
    if (combo) {
        res.send(combo);
    } else {
        res.sendStatus(404);
    }
});

// POST /api/combos - creates a new combo
app.post('/api/combos', (req, res) => {
    var combo = (req.body) as WrapperBoxCombo;

    service.addCombo(combo);
    res.sendStatus(201);
});

// PUT /api/combos/:id - updates a combo
app.put('/api/combos/:id', (req, res) => {
    const id = String(req.params.id);
    var combo = (req.body) as WrapperBoxCombo;

    combo._id = new ObjectId(id);

    try {
        service.updateCombo(combo);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    }
});

// DELETE /api/combos/:id - deletes a combo
app.delete('/api/combos/:id', (req, res) => {
    const id = String(req.params.id);
    try {
        service.deleteCombo(id);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    }
});

// GET /api/stats - returns average length statistics
app.get('/api/stats', async (req, res) => {
    const stats = await service.getAverageWrapperLengths();
    res.send(stats);
});

// GET /api - returns all endpoints
app.get('/api', (req, res) => {
    var html = readFileSync('./src/endpoints.html', 'utf8');
    res.send(html);

});

// start the server
app.listen(port, () => {
    console.log(`Box Storage app listening at http://localhost:${port}`);
});
