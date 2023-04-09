export type $Server = {
  url: string;
  description?: string;
  variables?: unknown;
};

export type $SwaggerSpec = {
  info: {
    title: string;
    version: string;
  };
  servers: Array<$Server>;
  openapi: string;
};

export type $ExternalDocs = {
  description?: string;
  url: string;
};

export type $Tag = {
  name: string;
  description?: string;
  externalDocs?: $ExternalDocs;
};

export type $SwaggerDefinition = {
  info?: {
    title?: string;
    version?: string;
    description?: string;
  };
  servers?: Array<$Server>;
  openapi?: string;
  swagger?: string;
  components?: {
    securitySchemes?: object;
  };
  security?: Array<object>;
  tags?: Array<$Tag>;
  externalDocs?: $ExternalDocs;
};

export type $SwaggerFilePaths = Array<string>;

export type $MultiRouteMode = 'root' | 'subpath';
