import React, { Suspense } from 'react';
import { CustomizerContextProvider } from './context/CustomizerContext';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from '../src/context/SocketContext';
import Spinner from './views/spinner/Spinner';
import './utils/i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <CustomizerContextProvider>
    <Suspense fallback={<Spinner />}>
      <AuthProvider>
           <SocketProvider> 
        <App />
              </SocketProvider>
      </AuthProvider>
    </Suspense>
  </CustomizerContextProvider>,
);
