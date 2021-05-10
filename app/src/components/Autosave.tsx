import React, { useEffect } from 'react';
import { useFormState } from 'react-final-form';
import { LOCAL_STORAGE_KEY } from '../constants';

/**
 * This component pulls form value state from context
 * and writes to local storage on every change
 */
const Autosave: React.FC = () => {
  const formState = useFormState();
  useEffect(() => {
    const json = JSON.stringify(formState.values);
    localStorage.setItem(LOCAL_STORAGE_KEY, json);
  }, [formState.values]);
  return null;
};

export default Autosave;
