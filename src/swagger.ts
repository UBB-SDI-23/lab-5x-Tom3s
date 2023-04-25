import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Box API Docs',
      version: '1.0.0',
      description: 'API Documentation for Boxes app',
    }
  },
  apis: ['./src/routes.ts'],
};

const specs = swaggerJsdoc(options);

import { Express, Request, Response } from 'express';

function setupSwagger(app: Express, port: number, ) {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // Docs in JSON format
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
}

export default setupSwagger;