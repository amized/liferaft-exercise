export interface UISchemaField {
  name: string;
  showif: any;
}

export interface UISchemaPage {
  title: string;
  path: string;
  fields: UISchemaField[];
}

export type SchemaType =
  | 'struct'
  | 'string'
  | 'email'
  | 'date'
  | 'integer'
  | 'boolean';

export interface SchemaProp {
  type: SchemaType;
  required: boolean;
  fields?: FieldMap;
  'ui:label': string;
}

export type FieldMap = Record<string, SchemaProp>;

export interface Config {
  application: FieldMap;
  ui: UISchemaPage[];
}
