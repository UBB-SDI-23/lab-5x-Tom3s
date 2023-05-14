// REST API

import { Box, Wrapper, Supplier, WrapperBoxCombo } from "./entities";
import { Express } from 'express';
import PGService from "./pgService";
import { tokenToString } from "typescript";

function setupRoutes(app: Express, service: PGService) {

    // GET /api/boxes/pages - returns the number of pages of boxes
    app.get('/api/boxes/pages', async (req, res) => {
        /*
        #swagger.tags = ['Boxes']
        #swagger.description = 'Endpoint to get the number of pages of boxes'
        #swagger.responses[200] = { description: 'Returned the number of pages of boxes' }
        */
        const pages = service.getBoxPageCount();
        res.send((await pages).toString());
    });

    // GET /api/boxes - returns all boxes
    app.get('/api/boxes', async (req, res) => {
        /*
        #swagger.tags = ['Boxes']
        #swagger.description = 'Endpoint to get all boxes'
        #swagger.responses[200] = { description: 'Returned all Boxes' }
        #swagger.responses[403] = { description: 'Deny returning all boxes if it\'s not confirmed' }
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page number',
            type: 'integer'
        }
        #swagger.parameters['all'] = {
            in: 'query',
            description: 'Confirms that all boxes should be returned',
            type: 'boolean'
        }
        */
        var query = req.query;
        if (query.page) {
            var pageNumber = parseInt(query.page as string);
            res.send(await service.getPageOfBoxes(pageNumber));
            return;
        }

        if (query.all && query.all == 'true') {
            res.send(await service.getAllBoxes());
            return;
        }

        // if no query parameters, return error 403 
        res.sendStatus(403);


    });

    // GET /api/boxes/:id - returns a single box by id

    app.get('/api/boxes/:id', async (req, res) => {
        /*
        #swagger.tags = ['Boxes']
        #swagger.description = 'Endpoint to get a box by id'
        #swagger.parameters['id'] = { 
            in: 'path',
            description: 'Box id (int)'
        }
        #swagger.responses[200] = { description: 'Box found' }
        #swagger.responses[404] = { description: 'Box not found' }
        */
        const id = parseInt(req.params.id);
        const box = service.getBoxById(id);
        if (box) {
            res.send(await box);
        } else {
            res.sendStatus(404);
        }
    });

    // POST /api/boxes - creates a new box
    app.post('/api/boxes', async (req, res) => {
        /*
        #swagger.tags = ['Boxes']
        #swagger.description = 'Endpoint to create a new box'
        #swagger.parameters['boxes'] = { 
            in: 'body',
            description: 'Single Box object or Array of boxes to create',
            required: true,
            schema: {
                $length: 10, 
                $width: 10, 
                $height: 10, 
                $material: 'metal', 
                $color: 'white'
            }
        }
        #swagger.parameters['sessiontoken'] = {
            in: 'header',
            description: 'Session token',
            required: true,
            type: 'string'
        }
        #swagger.responses[201] = { description: 'Box created' }
        #swagger.responses[400] = { description: 'Bad request' }
        */
        const token = req.headers.sessiontoken as string;
        if (req.body instanceof Array) {
            var boxes = (req.body) as Box[];
            try {
                await service.addBoxes(boxes, token);
                res.status(201).send("Boxes added");
            } catch (error: any) {
                res.status(400).send(error.message);
            }
        } else {
            var box = (req.body) as Box;

            try {
                await service.addBox(box, token);
                res.status(201).send("Box added");
            } catch (error: any) {
                res.status(400).send(error.message);
            }
        }
    });

    // PUT /api/boxes/:id - updates a box
    app.put('/api/boxes/:id', async (req, res) => {
        /*
        #swagger.tags = ['Boxes']
        #swagger.description = 'Endpoint to update a box'
        #swagger.parameters['id'] = { 
            description: 'Box id (int)',
            type: 'int',
            default: '10'
        }
        #swagger.parameters['box'] = {
            in: 'body',
            description: 'Box to update',
            required: true,
            schema: {
                $length: 10,
                $width: 10,
                $height: 10,
                $material: 'metal',
                $color: 'white'
            }
        }
        #swagger.parameters['sessiontoken'] = {
            in: 'header',
            description: 'Session token',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = { description: 'Box updated' }
        #swagger.responses[400] = { description: 'Bad request' }
        */
        const id = parseInt(req.params.id);

        var box = (req.body) as Box;
        box._id = id;

        const token = req.headers.sessiontoken as string;

        try {
            await service.updateBox(box, token);
            res.status(200).send("Box updated");
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    });

    // DELETE /api/boxes/:id - deletes a box
    app.delete('/api/boxes/:id', async (req, res) => {
        /*
        #swagger.tags = ['Boxes']
        #swagger.description = 'Endpoint to delete a box'
        #swagger.parameters['id'] = { description: 'Box id (int)' }
        #swagger.parameters['sessiontoken'] = {
            in: 'header',
            description: 'Session token',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = { description: 'Box deleted' }
        #swagger.responses[400] = { description: 'Bad request' }
        */

        const id = parseInt(req.params.id)
        const token = req.headers.sessiontoken as string;
        try {
            await service.deleteBox(id, token);
            res.status(200).send("Box deleted");
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    });

    // GET /api/wrappers/pages - returns the number of pages of wrappers
    app.get('/api/wrappers/pages', async (req, res) => {
        /*
        #swagger.tags = ['Wrappers']
        #swagger.description = 'Endpoint to get the number of pages of wrappers'
        #swagger.responses[200] = { description: 'Returned the number of pages of wrappers' }
        */
        const pages = service.getWrapperPageCount();
        res.send((await pages).toString());
    });

    // GET /api/wrappers - returns all wrappers
    app.get('/api/wrappers', async (req, res) => {
        /*
        #swagger.tags = ['Wrappers']
        #swagger.description = 'Endpoint to get all wrappers'
        #swagger.responses[200] = { description: 'Returned all Wrappers' }
        #swagger.responses[403] = { description: 'Deny returning all wrappers if it\'s not confirmed' }
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page number',
            type: 'integer'
        }
        #swagger.parameters['all'] = {
            in: 'query',
            description: 'Confirms that all wrappers should be returned',
            type: 'boolean'
        }
        */
        var query = req.query;
        if (query.page) {
            var pageNumber = parseInt(query.page as string);
            res.send(await service.getPageOfWrappers(pageNumber));
            return;
        }

        if (query.all && query.all == 'true') {
            res.send(await service.getAllWrappers());
            return;
        }

        // if no query parameters, return error 403
        res.sendStatus(403);
    });

    // GET /api/wrappers/:id - returns a single wrapper by id
    app.get('/api/wrappers/:id', async (req, res) => {
        /*
        #swagger.tags = ['Wrappers']
        #swagger.description = 'Endpoint to get a wrapper by id'
        #swagger.parameters['id'] = { 
#swagger.parameters['id'] = {
            in: 'path',
           type: 'int',
            description: 'Wrapper id (int)'
        }
        #swagger.responses[200] = { description: 'Wrapper found' }
        #swagger.responses[404] = { description: 'Wrapper not found' }
        */
        const id = parseInt(req.params.id)
        const wrapper = service.getWrapperById(id);
        if (wrapper) {
            res.send(await wrapper);
        } else {
            res.sendStatus(404);
        }
    });

    // POST /api/wrappers - creates a new wrapper
    app.post('/api/wrappers', async (req, res) => {
        /*
        #swagger.tags = ['Wrappers']
        #swagger.description = 'Endpoint to create a new wrapper'
        #swagger.parameters['wrapper'] = {
            in: 'body',
            description: 'Wrapper to create',
            required: true,
            schema: {
                $length: 10,
                $width: 10,
                $pattern: 'stripes',
                $color: 'white',
                $complementaryColor: 'black',
            }
        }
        #swagger.parameters['sessiontoken'] = {
            in: 'header',
            description: 'Session token',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = { description: 'Wrapper created' }
        #swagger.responses[400] = { description: 'Bad request' }
        */
        var wrapper = (req.body) as Wrapper;

        const token = req.headers.sessiontoken as string;

        try {
            await service.addWrapper(wrapper, token);
            res.status(200).send("Wrapper created");
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    });

    // PUT /api/wrappers/:id - updates a wrapper
    app.put('/api/wrappers/:id', async (req, res) => {
        /*
        #swagger.tags = ['Wrappers']
        #swagger.description = 'Endpoint to update a wrapper'
        #swagger.parameters['id'] = { 
        #swagger.parameters['id'] = {
            in: 'path',
            type: 'int',
            description: 'Wrapper id (int)'
        }
        #swagger.parameters['wrapper'] = {
            in: 'body',
            description: 'Wrapper to update',
            required: true,
            schema: {
                $length: 10,
                $width: 10,
                $pattern: 'stripes',
                $color: 'white',
                $complementaryColor: 'black',
            }
        }
        #swagger.parameters['sessiontoken'] = {
            in: 'header',
            description: 'Session token',
            required: true,
            type: 'string'
        }
        */
        const id = parseInt(req.params.id);
        var wrapper = (req.body) as Wrapper;
        wrapper._id = id;

        const token = req.headers.sessiontoken as string;

        try {
            await service.updateWrapper(wrapper, token);
            res.status(200).send("Wrapper updated");
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    });

    // DELETE /api/wrappers/:id - deletes a wrapper
    app.delete('/api/wrappers/:id', async (req, res) => {
        /*
        #swagger.tags = ['Wrappers']
        #swagger.description = 'Endpoint to delete a wrapper'
        #swagger.parameters['id'] = { 
        #swagger.parameters['id'] = {
            in: 'path',
            type: 'int',
            description: 'Wrapper id (int)'
        }
        #swagger.parameters['sessiontoken'] = {
            in: 'header',
            description: 'Session token',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = { description: 'Wrapper deleted' }
        #swagger.responses[400] = { description: 'Bad request' }
        */
        const id = parseInt(req.params.id)
        const token = req.headers.sessiontoken as string;
        try {
            await service.deleteWrapper(id, token);
            res.status(200).send("Wrapper deleted");
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    });

    // GET /api/suppliers/pages - returns the number of pages of suppliers
    app.get('/api/suppliers/pages', async (req, res) => {
        /*
        #swagger.tags = ['Suppliers']
        #swagger.description = 'Endpoint to get the number of pages of suppliers'
        #swagger.responses[200] = { description: 'Returned the number of pages of suppliers' }
        */
        const pages = service.getSupplierPageCount();
        res.send((await pages).toString());
    });


    // GET /api/suppliers - returns all suppliers
    app.get('/api/suppliers', async (req, res) => {
        /*
        #swagger.tags = ['Suppliers']
        #swagger.description = 'Endpoint to get all suppliers'
        #swagger.responses[200] = { description: 'Returned all Suppliers' }
        #swagger.responses[403] = { description: 'Deny returning all suppliers if it\'s not confirmed' }
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page number',
            type: 'integer'
        }
        #swagger.parameters['all'] = {
            in: 'query',
            description: 'Confirms that all suppliers should be returned',
            type: 'boolean'
        }
        */
        var query = req.query;
        if (query.page) {
            var pageNumber = parseInt(query.page as string);
            res.send(await service.getPageOfSuppliers(pageNumber));
            return;
        }

        if (query.all && query.all == 'true') {
            res.send(await service.getAllSuppliers());
            return;
        }

        // if no query parameters, return error 403
        res.sendStatus(403);

    });

    // GET /api/suppliers/:id - returns a single supplier by id
    app.get('/api/suppliers/:id', async (req, res) => {
        /*
        #swagger.tags = ['Suppliers']
        #swagger.description = 'Endpoint to get a supplier by id'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Supplier id (int)'
        }
        #swagger.responses[200] = { description: 'Supplier found' }
        #swagger.responses[404] = { description: 'Supplier not found' }
        */
        const id = parseInt(req.params.id)
        const supplier = service.getSupplierById(id);
        if (supplier) {
            res.send(await supplier);
        } else {
            res.sendStatus(404);
        }
    });

    // POST /api/suppliers - creates a new supplier
    app.post('/api/suppliers', async (req, res) => {
        /*
        #swagger.tags = ['Suppliers']
        #swagger.description = 'Endpoint to create a new supplier'
        #swagger.parameters['supplier'] = {
            in: 'body',
            description: 'Supplier to create',
            required: true,
            schema: {
                $name: 'Supplier Company S.R.L.',
                $address: 'Via Roma 1, 10000 Torino',
                $phone: '555-4200',
                $email: 'company@email.com',
                $wrappers: '',
            }
        }
        #swagger.parameters['sessiontoken'] = {
            in: 'header',
            description: 'Session token',
            required: true,
            type: 'string'
        }
        #swagger.responses[201] = { description: 'Supplier created' }
        #swagger.responses[400] = { description: 'Bad request' }
        */
        var supplier = (req.body) as Supplier;

        if (!supplier.wrappers) {
            supplier.wrappers = new Array<number>();
        }

        const token = req.headers.sessiontoken as string;

        try {
            await service.addSupplier(supplier, token);
            res.status(201).send("Supplier created");
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    });

    // PUT /api/suppliers/:id/:wrapperId - adds a wrapper to a supplier
    app.put('/api/suppliers/:id/:wrapperId', async (req, res) => {
        /*
        #swagger.tags = ['Suppliers']
        #swagger.description = 'Endpoint to add a wrapper to a supplier'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Supplier id (int)'
        }
        #swagger.parameters['wrapperId'] = {
            in: 'path',
            description: 'Wrapper id (int)'
        }
        #swagger.parameters['sessiontoken'] = {
            in: 'header',
            description: 'Session token',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = { description: 'Wrapper added to supplier' }
        #swagger.responses[404] = { description: 'Supplier or wrapper not found' }
        */
        const id = parseInt(req.params.id)
        const wrapperId = parseInt(req.params.wrapperId);

        const token = req.headers.sessiontoken as string;

        try {
            await service.addWrapperToSupplier(id, wrapperId, token);
            res.status(200).send("Wrapper added to supplier");
        } catch (error: any) {
            res.status(404).send(error.message);
        }
    });


    // PUT /api/suppliers
    app.put('/api/suppliers/:id', async (req, res) => {
        /*
        #swagger.tags = ['Suppliers']
        #swagger.description = 'Endpoint to update a supplier'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Supplier id (int)'
        }
        #swagger.parameters['supplier'] = {
            in: 'body',
            description: 'Supplier to update',
            required: true,
            schema: {
                $name: 'Supplier Company S.R.L.',
                $address: 'Via Roma 1, 10000 Torino',
                $phone: '555-4200',
                $email: 'company@email.com',
                $wrappers: '',
            }
        }
        #swagger.parameters['sessiontoken'] = {
            in: 'header',
            description: 'Session token',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = { description: 'Supplier updated' }
        #swagger.responses[400] = { description: 'Bad request' }
        */
        const id = parseInt(req.params.id)
        var supplier = (req.body) as Supplier;

        supplier._id = id;

        const token = req.headers.sessiontoken as string;

        try {
            await service.updateSupplier(supplier, token);
            res.status(200).send("Supplier updated");
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    });

    // DELETE /api/suppliers/:id - deletes a supplier
    app.delete('/api/suppliers/:id', async (req, res) => {
        /*
        #swagger.tags = ['Suppliers']
        #swagger.description = 'Endpoint to delete a supplier'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Supplier id (int)'
        }
        #swagger.parameters['sessiontoken'] = {
            in: 'header',
            description: 'Session token',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = { description: 'Supplier deleted' }
        #swagger.responses[400] = { description: 'Bad request' }
        */
        const id = parseInt(req.params.id)

        const token = req.headers.sessiontoken as string;

        try {
            await service.deleteSupplier(id, token);
            res.status(200).send("Supplier deleted");
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    });

    // GET /api/boxes/filter/:size - returns boxes larger than the given size
    app.get('/api/boxes/filter/:size', async (req, res) => {
        /*
        #swagger.tags = ['Boxes']
        #swagger.description = 'Endpoint to get boxes larger than the given size'
        #swagger.parameters['size'] = {
            in: 'path',
            description: 'Size to filter by',
            required: true,
            default: 10
        }
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page number',
            type: 'integer'
        }
        #swagger.parameters['all'] = {
            in: 'query',
            description: 'Confirms that all boxes should be returned',
            type: 'boolean'
        }
        #swagger.responses[200] = { description: 'Returned all boxes larger than the given size' }
        #swagger.responses[403] = { description: 'Deny returning all boxes if all is not set to true' }
        */
        const size = parseInt(req.params.size);

        var query = req.query;
        if (query.page) {
            var pageNumber = parseInt(query.page as string);
            res.send(await service.getBoxesLargerThan(size, pageNumber));
            return;
        }

        if (query.all && query.all == 'true') {
            res.send(await service.getBoxesLargerThan(size, 0, await service.getBoxPageCount(1)));
            return;
        }

        res.sendStatus(403);
    });

    // GET /api/combos/pages - returns the number of pages of combos
    app.get('/api/combos/pages', async (req, res) => {
        /*
        #swagger.tags = ['Combos']
        #swagger.description = 'Endpoint to get the number of pages of combos'
        #swagger.responses[200] = { description: 'Returned the number of pages of combos' }
        */
        const pages = service.getComboPageCount();
        res.send((await pages).toString());
    });

    // GET /api/combos - returns all combos
    app.get('/api/combos', async (req, res) => {
        /*
        #swagger.tags = ['Combos']
        #swagger.description = 'Endpoint to get all combos'
        #swagger.responses[200] = { description: 'Returned all combos' }
        #swagger.responses[403] = { description: 'Deny returning all combos if it\'s not confirmed' }
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page number',
            type: 'integer'
        }
        #swagger.parameters['all'] = {
            in: 'query',
            description: 'Confirms that all combos should be returned',
            type: 'boolean'
        }
        */
        var query = req.query;
        if (query.page) {
            var pageNumber = parseInt(query.page as string);
            res.send(await service.getPageOfCombos(pageNumber));
            return;
        }

        if (query.all && query.all == 'true') {
            res.send(await service.getAllCombos());
            return;
        }

        // if no query parameters, return error 403 
        res.sendStatus(403);

    });

    // GET /api/combos/:id - returns a single combo by id
    app.get('/api/combos/:id', async (req, res) => {
        /*
        #swagger.tags = ['Combos']
        #swagger.description = 'Endpoint to get a single combo by id'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Combo id (int)'
        }
        #swagger.responses[200] = { description: 'Returned a single combo by id' }
        #swagger.responses[404] = { description: 'Combo not found' }
        */
        const id = parseInt(req.params.id)
        try {
            res.send(await service.getComboById(id));
        } catch (error) {
            res.sendStatus(404);
        }
    });

    // POST /api/combos - creates a new combo
    app.post('/api/combos', async (req, res) => {
        /*
        #swagger.tags = ['Combos']
        #swagger.description = 'Endpoint to create a new combo'
        #swagger.parameters['combo'] = {
            in: 'body',
            description: 'Combo to create',
            required: true,
            schema: {
                $wrapperId: '641a01a58c240448a94767f8',
                $boxId: '6419faf56b23d736edce7bd6',
                $name: 'Combo 1',
                $price: 10.99,
            }
        }
        #swagger.parameters['sessiontoken'] = {
            in: 'header',
            description: 'Session token',
            required: true,
            type: 'string'
        }
        #swagger.responses[201] = { description: 'Combo created' }
        #swagger.responses[400] = { description: 'Invalid combo' }
        */
        var combo = (req.body) as WrapperBoxCombo;

        const token = req.headers.sessiontoken as string;

        try {
            await service.addCombo(combo, token);
            res.status(201).send("Combo created");
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    });

    // PUT /api/combos/:id - updates a combo
    app.put('/api/combos/:id', async (req, res) => {
        /*
        #swagger.tags = ['Combos']
        #swagger.description = 'Endpoint to update a combo'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Combo id (int)'
        }
        #swagger.parameters['combo'] = {
            in: 'body',
            description: 'Combo to update',
            required: true,
            schema: {
                $wrapperId: '641a01a58c240448a94767f8',
                $boxId: '6419faf56b23d736edce7bd6',
                $name: 'Combo 1',
                $price: 10.99,
            }
        }
        #swagger.parameters['sessiontoken'] = {
            in: 'header',
            description: 'Session token',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = { description: 'Combo updated' }
        #swagger.responses[400] = { description: 'Invalid combo' }
        */
        const id = parseInt(req.params.id)
        var combo = (req.body) as WrapperBoxCombo;
        combo._id = id;

        const token = req.headers.sessiontoken as string;

        try {
            await service.updateCombo(combo, token);
            res.status(200).send("Combo updated");
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    });

    // DELETE /api/combos/:id - deletes a combo
    app.delete('/api/combos/:id', async (req, res) => {
        /*
        #swagger.tags = ['Combos']
        #swagger.description = 'Endpoint to delete a combo'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Combo id (int)'
        }
        #swagger.parameters['sessiontoken'] = {
            in: 'header',
            description: 'Session token',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = { description: 'Combo deleted' }
        #swagger.responses[400] = { description: 'Invalid combo' }
        */
        const id = parseInt(req.params.id)

        const token = req.headers.sessiontoken as string;

        try {
            await service.deleteCombo(id, token);
            res.status(200).send("Combo deleted");
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    });

    // GET /api/stats - returns average length statistics
    app.get('/api/stats', async (req, res) => {
        /*
        #swagger.tags = ['Statistics']
        #swagger.description = 'Endpoint to get average length statistics'
        #swagger.responses[200] = { description: 'Returned average length statistics' }
        #swagger.responses[403] = { description: 'Deny returning average length statistics if it\'s not confirmed' }
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page number',
            type: 'integer'
        }
        #swagger.parameters['all'] = {
            in: 'query',
            description: 'Confirms that all supplier stats should be returned',
            type: 'boolean'
        }
        */

        var query = req.query;
        if (query.page) {
            var pageNumber = parseInt(query.page as string);
            res.send(await service.getAverageWrapperLengths(pageNumber));
            return;
        }

        if (query.all && query.all == 'true') {
            res.send(await service.getAverageWrapperLengths(0, await service.getSupplierPageCount(1)));
            return;
        }

        // if no query parameters, return error 403
        res.sendStatus(403);
    });

    // POST /api/register - returns a registration token
    app.post('/api/register', async (req, res) => {
        /*
        #swagger.tags = ['Authentication']
        #swagger.description = 'Endpoint to get a registration token'
        #swagger.responses[200] = { description: 'Returned a registration token' }
        #swagger.responses[403] = { description: 'Username Taken' }
        */
        // const username = req.query.username as string;
        // const password = req.query.password as string;

        const data = req.body as { username: string, password: string };
        const username = data.username;
        const password = data.password;

        if (!username || !password) {
            res.status(400).send('Username and password required');
            return;
        }

        try {
            const token = await service.getRegistrationToken(username, password);

            res.send(
                token
            );
        } catch (error: any) {
            res.status(403).send(error.message);
        }

    });

    // GET /api/register/:token - confirms a registration token
    app.get('/api/register/:token', async (req, res) => {
        /*
        #swagger.tags = ['Authentication']
        #swagger.description = 'Endpoint to confirm a registration token'
        #swagger.parameters['token'] = {
            in: 'path',
            description: 'Registration token (string)'
        }
        #swagger.responses[200] = { description: 'Confirmed a registration token' }
        #swagger.responses[400] = { description: 'Error occured during confirmation' }
        #swagger.responses[500] = { description: 'Internal server error' }
        */
        const token = req.params.token as string;

        try {
            if (await service.confirmRegistration(token)) {
                res.status(200).send('Registration successful');
            } else {
                res.sendStatus(500);
            }
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    });

    // POST /api/login - returns a login token
    app.post('/api/login', async (req, res) => {
        /*
        #swagger.tags = ['Authentication']
        #swagger.description = 'Endpoint to get a login token'
        #swagger.responses[200] = { description: 'Returned a login token' }
        #swagger.responses[400] = { description: 'Invalid username or password' }
        */
        const data = req.body as { username: string, password: string };
        const username = data.username;
        const password = data.password;

        if (!username || !password) {
            res.status(400).send('Username and password required');
            return;
        }

        try {
            const sessionDetails = await service.login(username, password);

            res.status(200).send(sessionDetails);
        } catch (error: any) {
            res.status(500).send(error.message);
        }
    });

    // GET /api/users/name/:id - returns a user's name
    app.get('/api/users/name/:id', async (req, res) => {
        /*
        #swagger.tags = ['Users']
        #swagger.description = 'Endpoint to get a user\'s name'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'User id (int)'
        }
        #swagger.responses[200] = { description: 'Returned a user\'s name' }
        #swagger.responses[404] = { description: 'User not found' }
        */
        const id = parseInt(req.params.id)
        try {
            res.send(await service.getUserName(id));
        } catch (error: any) {
            res.status(404).send(error.message);
        }
    });

    // GET /api/users/:id - returns a user's all details
    app.get('/api/users/:id', async (req, res) => {
        /*
        #swagger.tags = ['Users']
        #swagger.description = 'Endpoint to get a user\'s all details'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'User id (int)'
        }
        #swagger.parameters['lists'] = {
            in: 'query',
            description: 'If true, returns user\'s lists',
            type: 'boolean'
        }
        #swagger.responses[200] = { description: 'Returned a user\'s all details' }
        #swagger.responses[404] = { description: 'User not found' }
        */
        const id = parseInt(req.params.id)

        const lists: boolean = req.query.lists == 'true';

        try {
            res.send(await service.getUserById(id, lists));
        } catch (error: any) {
            res.status(404).send(error.message);
        }
    });

    // PUT /api/users/:id/role - updates a user's details
    app.put('/api/users/:id/role', async (req, res) => {
        /*
        #swagger.tags = ['Users']
        #swagger.description = 'Endpoint to update a user\'s role'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'User id (int)'
        }
        #swagger.parameters['role'] = {
            in: 'body',
            description: 'User role (string)',
            schema: {
                role: 'user'
            }
        }
        #swagger.parameters['sessiontoken'] = {
            in: 'header',
            description: 'Session token (string)'
        }
        #swagger.responses[200] = { description: 'Updated a user\'s role' }
        #swagger.responses[403] = { description: 'Not authorized' }
        #swagger.responses[404] = { description: 'User not found' }
        */
        const id = parseInt(req.params.id)
        const role = req.body.role as string;
        const sessiontoken = req.headers.sessiontoken as string;

        try {
            await service.updateUserRole(sessiontoken, id, role);
            res.status(200).send('Updated user role');
        } catch (error: any) {
            res.status(403).send(error.message);
        }
    });
}

export default setupRoutes;