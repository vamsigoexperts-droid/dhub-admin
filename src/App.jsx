import { useContext } from 'react';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { useAuth } from 'src/context/AuthContext'; // ✅ Add this
import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import { CssBaseline, ThemeProvider, CircularProgress, Box } from '@mui/material';
import { RouterProvider } from 'react-router';
import router from './routes/Router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const theme = ThemeSettings();
  const { activeDir } = useContext(CustomizerContext);
  const { loading } = useAuth(); // ✅ Get loading state

  // ✅ Show loader while checking authentication
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <RTL direction={activeDir}>
        <CssBaseline />
        <RouterProvider router={router} />
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={activeDir === 'rtl'}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme.palette.mode}
          style={{ zIndex: 9999 }}
        />
      </RTL>
    </ThemeProvider>
  );
}

export default App;
