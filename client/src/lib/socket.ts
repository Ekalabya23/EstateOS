import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';

// We store the socket instance globally so it can be exported and used in other components without re-rendering
export let socketInstance: Socket | null = null;

export const useSocket = () => {
  const { isAuthenticated, user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Get the token from cookies or however it's stored. 
      // Since it's HTTP-only cookie, we might not have it in JS, but wait!
      // In our auth logic, does the frontend have the token?
      // Let's check: our API uses cookies. But Socket.io cross-origin doesn't easily send cookies unless configured.
      // Wait, we configured `{ withCredentials: true }` in axios, which sends cookies.
      // Let's configure socket.io to send cookies.
      
      const socket = io('http://localhost:5000', {
        withCredentials: true,
      });

      socketRef.current = socket;
      socketInstance = socket;

      socket.on('connect', () => {
        console.log('🔌 Connected to EstateOS Realtime Engine');
        socket.emit('join', user._id || user.id);
      });

      socket.on('notification', (data) => {
        // Show a sleek toast notification
        toast(data.message, {
          icon: '🔔',
          style: {
            borderRadius: '12px',
            background: 'var(--color-charcoal)',
            color: '#fff',
            fontSize: '13px',
            padding: '16px',
          },
        });
        
        // Dispatch custom event for the bell icon to catch
        window.dispatchEvent(new CustomEvent('estateos-notification', { detail: data }));
      });

      socket.on('disconnect', () => {
        console.log('🔌 Disconnected from Realtime Engine');
      });

      return () => {
        socket.disconnect();
        socketInstance = null;
      };
    }
  }, [isAuthenticated, user]);

  return socketRef.current;
};
