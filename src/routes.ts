// REST API

import { ObjectId } from "mongodb";
import { Box, Wrapper, Supplier, WrapperBoxCombo } from "./entities";
import { Service } from "./service";
import { Express, Request, Response } from 'express';

function setupRoutes(app: Express, service: Service){
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
}

export default setupRoutes;