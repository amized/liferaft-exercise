import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import Field from './Field';
import { UISchemaField } from '../types';
import styled from 'styled-components';
import { useForm, useFormState } from 'react-final-form';
import jsonLogic from 'json-logic-js';
import _ from 'lodash';

interface Props {
  title: string;
  fields?: Array<UISchemaField>;
  next?: string;
  back?: string;
}

/**
 * A page represents the current "step". It is associated
 * with a route from the config and provides funtionality
 * to allow forward and back navigation, and logic
 * for determining whether the user has completed the fields
 * on the page.
 */
const Page: React.FC<Props> = ({ fields, next, back, title }) => {
  const formState = useFormState();
  const history = useHistory();
  const form = useForm();
  useEffect(() => {
    // On component mount, reset the form to kick in the
    // validation (which toggles whether the next button is enabled)
    form.reset(formState.values);
  }, []); // eslint-disable-line

  // Filter out any fields that should not be included on the page
  // due to "showif" toggling
  const applicableFields = useMemo(
    () =>
      fields?.filter((field) => {
        if (field.showif) {
          return jsonLogic.apply(field.showif, formState.values);
        }
        return true;
      }),
    [formState.values, fields]
  );

  const hasErrors = useMemo(
    () =>
      applicableFields?.reduce((acc, curr) => {
        const hasError = _.get(formState.errors, curr.name) !== undefined;
        return acc || hasError;
      }, false),
    [formState.errors, applicableFields]
  );

  const handleNext = useCallback(() => {
    history.push(`/${next}`);
  }, [next, history]);

  const handleBack = useCallback(() => {
    history.push(`/${back}`);
  }, [back, history]);

  if (!applicableFields) {
    throw Error('Missing fields for page');
  }

  return (
    <>
      <h1>{title}</h1>
      <FieldsWrapper>
        {applicableFields.map((field) => {
          return (
            <div key={field.name}>
              <Field name={field.name} showif={field.showif}></Field>
            </div>
          );
        })}
      </FieldsWrapper>
      <Nav>
        {back ? <button onClick={handleBack}>Back</button> : <span />}
        {next ? (
          <button disabled={hasErrors} onClick={handleNext}>
            Next
          </button>
        ) : (
          <button disabled={formState.invalid} type="submit">
            Submit
          </button>
        )}
      </Nav>
    </>
  );
};

const FieldsWrapper = styled.div`
  min-height: 300px;
`;

const Nav = styled.div`
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
`;

export default Page;
