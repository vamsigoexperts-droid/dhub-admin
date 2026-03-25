import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [newBookings, setNewBookings] = useState([]); // Store new bookings here
  const [pendingBookings, setPendingBookings] = useState([]);

  useEffect(() => {
    // Check if socket exists from login
    if (window.adminSocket) {
      console.log('✅ Socket context initialized');
      setSocket(window.adminSocket);
      setConnected(window.adminSocket.connected);

      // ✅ CONNECTION EVENTS
      window.adminSocket.on('connect', () => {
        console.log('✅ Socket connected in context');
        setConnected(true);
      });

      window.adminSocket.on('disconnect', () => {
        console.log('❌ Socket disconnected in context');
        setConnected(false);
      });

      // ✅ LISTEN FOR PENDING NOTIFICATIONS (when admin comes online)
      window.adminSocket.on('pendingNotificationsSummary', (summary) => {
        console.log('📋 Pending notifications received:', summary);
        if (summary?.count > 0) {
          setPendingBookings(summary.bookings || []);
          toast.info(`You have ${summary.count} pending booking(s) from when you were offline`, {
            autoClose: 7000
          });
        }
      });

      // ✅ MAIN EVENT: LISTEN FOR NEW BOOKINGS (ALWAYS ACTIVE)
      window.adminSocket.on('newBookingCreated', (booking) => {
        console.log('🔔 NEW BOOKING RECEIVED IN CONTEXT:', booking);
        
        // Add to state - OrderNotificationPopup will use this
        setNewBookings(prev => [...prev, booking]);
        
        // Optional: Play sound here (global notification)
        playNotificationSound();
        
        // Optional: Show toast
        toast.success(`New booking: ${booking.orderId || 'Order received'}!`, {
          autoClose: 3000
        });
      });

      // Cleanup on unmount
      return () => {
        console.log('🔇 Cleaning up socket listeners');
        window.adminSocket.off('connect');
        window.adminSocket.off('disconnect');
        window.adminSocket.off('pendingNotificationsSummary');
        window.adminSocket.off('newBookingCreated');
      };
    }
  }, []); // ✅ Empty array - runs once and stays active

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not available');
    }
  };

  // ✅ Function to clear a booking from queue (when popup is dismissed)
  const clearBooking = (bookingId) => {
    setNewBookings(prev => prev.filter(b => b._id !== bookingId));
  };

  const value = {
    socket,
    connected,
    newBookings,      // ✅ New bookings array
    pendingBookings,  // ✅ Offline bookings
    clearBooking      // ✅ Function to remove from queue
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
