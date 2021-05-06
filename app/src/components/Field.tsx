import React from 'react';
import { SchemaProp, SchemaType } from '../types';
import {
  Field as FormField,
  FieldInputProps,
  FieldMetaState
} from 'react-final-form';
import styled from 'styled-components';
import { useConfig } from '../context/config';
import _ from 'lodash';

interface Props {
  name: string;
  showif: any;
}

const required = (val: any) => {
  if (val === undefined) {
    return 'This field is required.';
  }
  return undefined;
};

const validateEmail = (email: string) => {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valid) {
    return 'That is not a valid email address';
  }
};

const Field: React.FC<Props> = ({ name }) => {
  const config = useConfig();

  // UI lists field names in object notation so break this down
  // to access the field properties from the application config
  const fieldPropsPath = name.replace(/\./g, '.fields.').split('.');
  const fieldProps = _.get(config.application, fieldPropsPath) as SchemaProp;

  if (!fieldProps) {
    throw Error(`Unable to find field definition in schema for ${name}`);
  }

  // We're only looking for "leaf" fields here (primitive types) so ignore structs
  if (fieldProps.type === 'struct') {
    return null;
  }

  const validations =
    fieldProps.type === 'email'
      ? validateEmail
      : fieldProps.required
      ? required
      : undefined;

  return (
    <Wrapper>
      <FormField name={name} validate={validations}>
        {({ input, meta }) => {
          return (
            <>
              <FieldLabel error={meta.error && meta.touched}>
                {fieldProps['ui:label']}
                {fieldProps.required ? '*' : ''}
              </FieldLabel>
              <div>
                <Widget type={fieldProps.type} input={input} meta={meta} />
                {meta.error && meta.touched ? (
                  <ErrorMsg>{meta.error}</ErrorMsg>
                ) : null}
              </div>
            </>
          );
        }}
      </FormField>
    </Wrapper>
  );
};

interface WidgetProps {
  type: SchemaType;
  input: FieldInputProps<any>;
  meta: FieldMetaState<any>;
}

const Widget: React.FC<WidgetProps> = ({ type, input, meta }) => {
  switch (type) {
    case 'string':
      return <input type="text" {...input} />;
    case 'email':
      return <input type="email" {...input} />;
    case 'date':
      return <input type="date" {...input} />;
    case 'integer':
      return <input type="number" {...input} />;
    case 'boolean': {
      return (
        <div>
          <label>
            <input
              type="radio"
              name={input.name}
              onChange={input.onChange}
              value="yes"
              checked={input.value === 'yes'}
            />{' '}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name={input.name}
              onChange={input.onChange}
              value="no"
              checked={input.value === 'no'}
            />{' '}
            No
          </label>
        </div>
      );
    }
    default:
      return <>Blank</>;
  }
};

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const FieldLabel = styled.label<{ error: boolean }>`
  width: 200px;
  flex: 0 0 200px;
  color: ${(props) => (props.error ? 'red' : 'auto')};
`;

const ErrorMsg = styled.div`
  color: red;
  margin-top: 5px;
`;

export default Field;
