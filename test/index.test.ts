// Global Types
import type {
  Router as $Router,
} from 'express';

// Helpers
import _ from 'lodash';
import express from 'express';

import swaggerUIRouter, {
  assembleSwaggerConfig,
} from '../src';

// Types
type $Layer = {
  route?: {
    path: string,
  },
};

// Searches for a path in router
const endpointIsSet = (router: $Router, endpoint: string): boolean => {
  const layers: Array<$Layer> = _.get(
    router,
    'stack',
  );

  const foundLayer = _.find(
    layers,
    (layer: $Layer) => _.get(
      layer,
      'route.path',
    ) === endpoint,
  ) as $Layer | undefined;

  return typeof foundLayer !== 'undefined';
};

describe(
  'swaggerUI-router',
  () => {
    const mockApis = ['./src/routes/**/*.js'];
    let router: $Router;

    beforeEach(() => {
      router = express.Router();
    });

    it(
      'should set an endpoint',
      () => {
        const endpoint = '/api-docs';

        router = swaggerUIRouter(
          router,
          endpoint,
          mockApis,
        );

        expect(endpointIsSet(
          router,
          endpoint,
        )).toBe(true);
      },
    );

    it(
      'should set a json endpoint',
      () => {
        const endpoint = '/api-docs/swagger.json';

        router = swaggerUIRouter(
          router,
          endpoint,
          mockApis,
        );

        expect(endpointIsSet(
          router,
          endpoint,
        )).toBe(true);
      },
    );

    describe(
      'swaggerConfig',
      () => {
        it(
          'should have UNDEFINED servers, components, security, tags if swaggerDefinition WAS NOT passed',
          () => {
            const {
              swaggerDefinition,
            } = assembleSwaggerConfig(mockApis);

            expect(swaggerDefinition.servers).toBeUndefined();
            expect(swaggerDefinition.components).toBeUndefined();
            expect(swaggerDefinition.security).toBeUndefined();
            expect(swaggerDefinition.tags).toBeUndefined();
          },
        );

        it(
          'should have DEFINED servers, components, security, tags if swaggerDefinition WAS passed',
          () => {
            const {
              swaggerDefinition,
            } = assembleSwaggerConfig(
              mockApis,
              {
                components: {
                  securitySchemes: {
                  },
                },
                security: [],
                servers: [{
                  url: '/v1.0',
                }],
                tags: [],
              },
            );

            expect(swaggerDefinition.servers).not.toBeUndefined();
            expect(swaggerDefinition.components).not.toBeUndefined();
            expect(swaggerDefinition.security).not.toBeUndefined();
            expect(swaggerDefinition.tags).not.toBeUndefined();
          },
        );
      },
    );
  },
);
