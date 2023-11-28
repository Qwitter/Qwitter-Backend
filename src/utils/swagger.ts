import { Express, Response, Request } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API Docs',
      version,
      description:
        'For any pagination add page,limit as query parameters. Default is limit 10',
    },
    servers: [{ url: process.env.URL }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {
      400: {
        description: 'Missing Credentials - Plese check the API documentation',
        contents: 'application/json',
      },
      401: {
        description: 'Unauthorized - incorrect API key or incorrect format',
        contents: 'application/json',
      },
      403: {
        description:
          'Permission Denied. You do not have the rights to access this request',
        contents: 'application/json',
      },
      404: {
        description: 'Not found - the request Data was not found',
        contents: 'application/json',
      },
      500: {
        description: 'A problem has occurred. Sorry for inconvenience',
        contents: 'application/json',
      },
      410: {
        description: 'The requested data is not available',
        contents: 'application/json',
      },
      408: {
        description: 'The request timed out. Please try again',
        contents: 'application/json',
        schema: { error: 'The request timed out. Please try again' },
      },
      409: {
        description: 'Conflict Occured. Check again ',
        contents: 'application/json',
        schema: { error: 'Conflict Occured. Check again' },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/schemas/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  // Swagger page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
