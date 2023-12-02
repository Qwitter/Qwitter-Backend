# Qwitter-Backend

Qwitter Backend

It contains REST APIs for several things

## Running the server

- Add your .env file
- Install the required dependencies by running the following command "npm install"
- To run the server in the dev environment, run "npm run serve"

## Used 3rd Party Libraries

- JSDoc and Swagger for API documentation
- Zod for Schema Validation
- Prisma as an ORM

## Code Structure

- /schemas: Contains the zod schemas for validation [payload,params]. Params is for request parameters and payload is for the request body. In addition to the schemas for Swagger[RequestBody,ResponseBody]
- /routes: The endpoints for each module including its main Swagger documentation
- /controllers: The logic of each route
-
-
