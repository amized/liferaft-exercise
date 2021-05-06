import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ConfigProvider } from './context/config';

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
