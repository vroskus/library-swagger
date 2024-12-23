/* eslint-disable perfectionist/sort-modules */
export type $ExternalDocs = {
  description?: string;
  url: string;
};

export type $MultiRouteMode = 'root' | 'subpath';

export type $Server = {
  description?: string;
  url: string;
  variables?: unknown;
};

export type $Tag = {
  description?: string;
  externalDocs?: $ExternalDocs;
  name: string;
};

export type $SwaggerDefinition = {
  components?: {
    securitySchemes?: Record<string, unknown>;
  };
  externalDocs?: $ExternalDocs;
  info?: {
    description?: string;
    title?: string;
    version?: string;
  };
  openapi?: string;
  security?: Array<Record<string, unknown>>;
  servers?: Array<$Server>;
  swagger?: string;
  tags?: Array<$Tag>;
};

export type $SwaggerFilePaths = Array<string>;

export type $SwaggerSpec = {
  info: {
    title: string;
    version: string;
  };
  openapi: string;
  servers: Array<$Server>;
};
