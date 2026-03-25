// import { createContext, useContext, useState, useEffect } from 'react';
// import { URLS } from '../Url';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(() => localStorage.getItem('token') || '');

//   useEffect(() => {
//     if (token) {
//       const storedUser = JSON.parse(localStorage.getItem('user'));
//       setUser(storedUser);
//     }
//   }, [token]);

//   const signin = async (email, password) => {
//     const response = await axios.post(URLS.LogIn, { email, password });

//     if (response.status === 200) {
//       const userData = response.data;
//       const jwtToken = userData?.token;

//       localStorage.setItem('token', jwtToken);
//       localStorage.setItem('user', JSON.stringify(userData));
//       setToken(jwtToken);
//       setUser(userData);
//     } else {
//       throw new Error(response.data.message || 'Login failed');
//     }
//   };

//   const signout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setToken('');
//     setUser(null);
//   };

//   const isAuthenticated = Boolean(token);

//   return (
//     <AuthContext.Provider value={{ user, token, isAuthenticated, signin, signout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { URLS } from '../Url';

// // âœ… Named export of the context
// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem('user');
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   const [token, setToken] = useState(() => localStorage.getItem('token') || '');

//   // Load user from localStorage on mount if token is present
//   useEffect(() => {
//     if (token && !user) {
//       const storedUser = localStorage.getItem('user');
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//       }
//     }
//   }, [token, user]);

//   const signin = async (email, password) => {
//     try {
//       const response = await axios.post(URLS.LogIn, { email, password });

//       if (response.status === 200 && response.data?.token) {
//         const userData = response.data;
//         const jwtToken = userData.token;

//         // Save token and user to localStorage
//         localStorage.setItem('token', jwtToken);
//         localStorage.setItem('user', JSON.stringify(userData));

//         // Update state
//         setToken(jwtToken);
//         setUser(userData);
//       } else {
//         throw new Error('Invalid response from server');
//       }
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || error.message || 'Login failed';
//       throw new Error(errorMessage);
//     }
//   };

//   const signout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setToken('');
//     setUser(null);
//   };

//   const isAuthenticated = Boolean(token);

//   return (
//     <AuthContext.Provider value={{ user, token, isAuthenticated, signin, signout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // âœ… Named export of the hook
// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import { URLS } from '../Url';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true); // âœ… Add loading state

  // âœ… CHECK TOKEN ON APP MOUNT (runs once when app loads)
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);

          console.log('âœ… Token found, user authenticated');

          // âœ… CONNECT SOCKET AUTOMATICALLY (even if user didn't login now)
          setTimeout(() => {
            connectSocket(userData);
          }, 500);
        } else {
          console.log('âŒ No token found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // âœ… Runs once on app mount



  const connectSocket = (userData) => {
    // Don't connect if already connected
    if (window.adminSocket && window.adminSocket.connected) {
      console.log('âœ… Socket already connected');
      return window.adminSocket;
    }

    const adminId = userData?.user?._id || userData?._id;

    if (!adminId) {
      console.warn('âŒ No admin ID found');
      return null;
    }

    console.log('ðŸ”Œ Connecting socket for admin:', adminId);

    try {
      // âœ… MATCH YOUR BACKEND: WebSocket only
      const socket = io(URLS.FileBase, {
        transports: ['websocket'], // âœ… WebSocket ONLY (like your backend)
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        autoConnect: true,
        forceNew: false
      });

      let connectionTimeout = setTimeout(() => {
        if (!socket.connected) {
          console.warn('âš ï¸ Socket connection timeout');
          toast.warning('Unable to connect for real-time notifications', {
            autoClose: 5000
          });
        }
      }, 15000);

      socket.on('connect', () => {
        clearTimeout(connectionTimeout);
        console.log('âœ… Socket connected:', socket.id);

        // âœ… Register admin (exactly like your backend code)
        socket.emit('registerAdmin', { adminId: adminId });
        console.log('ðŸ“ Admin registered:', adminId);

        // âœ… Join admin room (exactly like your backend code)
        socket.emit('joinRoom', 'adminRoom');
        console.log('ðŸšª Joined adminRoom');

        // toast.success('ðŸ”” Real-time notifications enabled!');
      });

      socket.on('disconnect', (reason) => {
        console.log('âŒ Socket disconnected:', reason);

        if (reason === 'io server disconnect') {
          socket.connect();
        }
      });

      socket.on('reconnect', (attemptNumber) => {
        console.log('ðŸ”„ Reconnected after', attemptNumber, 'attempts');
        socket.emit('registerAdmin', { adminId: adminId });
        socket.emit('joinRoom', 'adminRoom');
        toast.info('Connection restored!');
      });

      socket.on('connect_error', (error) => {
        console.error('âŒ Connection error:', error.message);
      });

      socket.on('error', (error) => {
        console.error('âŒ Socket error:', error);
      });

      window.adminSocket = socket;
      return socket;

    } catch (error) {
      console.error('âŒ Socket initialization error:', error);
      return null;
    }
  };


  const disconnectSocket = () => {
    if (window.adminSocket) {
      console.log('ðŸ”Œ Disconnecting socket');
      try {
        window.adminSocket.disconnect();
        window.adminSocket = null;
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    }
  };

  const signin = async (email, password) => {
    try {
      const response = await axios.post(URLS.LogIn, { email, password });

      if (response.status === 200 && response.data?.token) {
        const userData = response.data;
        const jwtToken = userData.token;

        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));

        setToken(jwtToken);
        setUser(userData);

        // Connect socket after login
        setTimeout(() => {
          connectSocket(userData);
        }, 500);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const signout = () => {
    disconnectSocket();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      signin,
      signout,
      loading // âœ… Expose loading state
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
