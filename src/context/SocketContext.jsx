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
  const [newBookings, setNewBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);

  useEffect(() => {
    if (!window.adminSocket) {
      return undefined;
    }

    const adminSocket = window.adminSocket;
    console.log('Socket context initialized');
    setSocket(adminSocket);
    setConnected(adminSocket.connected);

    const handleConnect = () => {
      console.log('Socket connected in context');
      setConnected(true);
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected in context');
      setConnected(false);
    };

    const handlePendingNotifications = (summary) => {
      console.log('Pending notifications received:', summary);
      if (summary?.count > 0) {
        setPendingBookings(summary.bookings || []);
        toast.info(`You have ${summary.count} pending booking(s) from when you were offline`, {
          autoClose: 7000,
        });
      }
    };

    const handleNewBooking = (booking) => {
      console.log('NEW BOOKING RECEIVED IN CONTEXT:', booking);
      setNewBookings((prev) => [...prev, booking]);
      toast.success(`New booking: ${booking.orderId || 'Order received'}!`, {
        autoClose: 3000,
      });
    };

    adminSocket.on('connect', handleConnect);
    adminSocket.on('disconnect', handleDisconnect);
    adminSocket.on('pendingNotificationsSummary', handlePendingNotifications);
    adminSocket.on('newBookingCreated', handleNewBooking);

    return () => {
      console.log('Cleaning up socket listeners');
      adminSocket.off('connect', handleConnect);
      adminSocket.off('disconnect', handleDisconnect);
      adminSocket.off('pendingNotificationsSummary', handlePendingNotifications);
      adminSocket.off('newBookingCreated', handleNewBooking);
    };
  }, []);

  const clearBooking = (bookingId) => {
    setNewBookings((prev) => prev.filter((b) => b._id !== bookingId));
  };

  const value = {
    socket,
    connected,
    newBookings,
    pendingBookings,
    clearBooking,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
