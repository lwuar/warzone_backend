const swaggerAutogen = require('swagger-autogen')();
const busiConfig = require("./app/config/business.config.js");

const doc = {
    info: {
        title: 'Warzone APP Backend API',
        description: 'API for COMP 4521 Warzone APP',
    },
    host: `${busiConfig.DOMAIN}:8090`,
    basePath: "/",
    schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);