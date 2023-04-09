// Global Types
import type {
  Request as $Request,
  Response as $Response,
  Router as $Router,
} from 'express';

// Helpers
import _ from 'lodash';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import {
  dirname,
  join,
} from 'path';

// Types
import {
  $MultiRouteMode,
  $Server,
  $SwaggerDefinition,
  $SwaggerFilePaths,
  $SwaggerSpec,
} from './types';

export type $SwaggerConfig = {
  swaggerDefinition: $SwaggerDefinition;
  apis: $SwaggerFilePaths;
};

// adaptSwaggerSpecToMultiRoute private method
type $AdaptSwaggerSpecToMultiRoute = (
  mode: $MultiRouteMode,
  swaggerSpec: $SwaggerSpec,
  req: $Request,
) => $SwaggerSpec;

const adaptSwaggerSpecToMultiRoute: $AdaptSwaggerSpecToMultiRoute = (mode, swaggerSpec, req) => {
  const multiRouteSwaggerSpec = swaggerSpec;

  multiRouteSwaggerSpec.servers.forEach((server: $Server, index: number) => {
    multiRouteSwaggerSpec.servers[index].url = join(
      mode === 'subpath' ? dirname(req.baseUrl) : req.baseUrl,
      server.url,
    );
  });

  return multiRouteSwaggerSpec;
};

// assembleSwaggerConfig private method
type $AssembleSwaggerConfig = (
  swaggerFilePaths: $SwaggerFilePaths,
  swaggerDefinition?: $SwaggerDefinition,
) => $SwaggerConfig;

export const assembleSwaggerConfig: $AssembleSwaggerConfig = (
  swaggerFilePaths,
  swaggerDefinition,
) => {
  const assembledSwaggerDefinition = swaggerDefinition || {
  };

  return {
    apis: swaggerFilePaths,
    swaggerDefinition: assembledSwaggerDefinition,
  };
};

// buildSwaggerSpec private method
type $BuildSwaggerSpec = (
  swaggerFilePaths: $SwaggerFilePaths,
  swaggerDefinition?: $SwaggerDefinition,
) => $SwaggerSpec;

const buildSwaggerSpec: $BuildSwaggerSpec = (
  swaggerFilePaths,
  swaggerDefinition,
) => swaggerJSDoc(
  assembleSwaggerConfig(
    swaggerFilePaths,
    swaggerDefinition,
  ),
);

// setupSwaggerUI private method
type $SetupSwaggerUI = (swaggerSpec: $SwaggerSpec) => (req: $Request, res: $Response) => void;

const setupSwaggerUI: $SetupSwaggerUI = (
  swaggerSpec,
) => (...args) => swaggerUI.setup(swaggerSpec)(...args);

const swagger = (
  router: $Router,
  endpoint: string,
  swaggerFilePaths: $SwaggerFilePaths,
  swaggerDefinition?: $SwaggerDefinition,
  multiRoute?: $MultiRouteMode,
): $Router => {
  const trimmedEndpoint: string = _.trimEnd(
    endpoint,
    '/',
  );

  router.use(
    trimmedEndpoint,
    swaggerUI.serve,
  );

  router.get(
    `${trimmedEndpoint}/swagger.json`,
    (req: $Request, res: $Response) => {
      res.setHeader(
        'Content-Type',
        'application/json',
      );
      const swaggerSpec: $SwaggerSpec = buildSwaggerSpec(
        swaggerFilePaths,
        swaggerDefinition,
      );

      const preparedSwaggerSpec = multiRoute
        ? adaptSwaggerSpecToMultiRoute(
          multiRoute,
          swaggerSpec,
          req,
        )
        : swaggerSpec;

      res.send(preparedSwaggerSpec);
    },
  );

  router.get(
    endpoint,
    (req: $Request, res: $Response) => {
      const swaggerSpec: $SwaggerSpec = buildSwaggerSpec(
        swaggerFilePaths,
        swaggerDefinition,
      );

      const preparedSwaggerSpec = multiRoute
        ? adaptSwaggerSpecToMultiRoute(
          multiRoute,
          swaggerSpec,
          req,
        )
        : swaggerSpec;

      setupSwaggerUI(preparedSwaggerSpec)(
        req,
        res,
      );
    },
  );

  return router;
};

export default swagger;
