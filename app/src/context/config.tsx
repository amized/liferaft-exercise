import React, { createContext, useContext, useEffect, useState } from 'react';
import { Config } from '../types';
import { API_URL } from '../constants';

const ConfigContext = createContext<Config>({} as Config);

export const ConfigProvider: React.FC = ({ children }) => {
  const [schema, setSchema] = useState<Config | null>(null);

  useEffect(() => {
    const loadSchema = async () => {
      const schemaResult = await fetch(API_URL);
      const json = (await schemaResult.json()) as Config;
      setSchema(json);
    };
    loadSchema();
  }, []);

  if (!schema) {
    return <>"Loading..."</>;
  }

  return (
    <ConfigContext.Provider value={schema}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => {
  return useContext(ConfigContext);
};
