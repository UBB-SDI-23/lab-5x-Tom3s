import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response } from 'express';

function initSwagger(app: Express, port: number) {
    const swaggerAutogen = require('swagger-autogen')()

    const outputFile = './swagger_output.json'
    const endpointsFiles = ['./src/routes.ts']

    const apiDocs = {
        swagger: '3.0',
        info: {
            title: 'API Documentation for Boxes app',
            description: 'Description',
        },
        host: 'localhost:80',
        schemes: ['http'],
    };

    swaggerAutogen(outputFile, endpointsFiles, apiDocs)
}

// import swaggerFile from './swagger_output.json';
import fs from 'fs';

function applySwagger(app: Express, port: number) {
    var swaggerFile = JSON.parse(fs.readFileSync('./src/swagger_output.json', 'utf-8'))
    // Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

    // Docs in JSON format
    app.get('/api-docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerFile);
    });
}

function setupSwagger(app: Express, port: number) {
    initSwagger(app, port);
    // applySwagger(app, port);
    // try applying swagger every second until it works

    var repeat: NodeJS.Timeout;

    var tryApplySwagger = function () {
        try {
            applySwagger(app, port);
            console.log('Swagger applied');
            clearInterval(repeat);
          } catch (error) {
            console.log('./swagger_output.json not yet ready');
        }
    }

    var repeat = setInterval(() => {
        tryApplySwagger();
    }, 1000);
}

export default setupSwagger;