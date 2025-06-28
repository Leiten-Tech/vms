import { useEffect, useState } from 'react';

const InternetStatusNotification = () => {
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const connection: any = null;
//   const connection: any = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  useEffect(() => {
    const checkConnectionSpeed = () => {
      if (connection) {
        // Use effective type to detect slow connections
        const { effectiveType } = connection;
        if (effectiveType === '2g' || effectiveType === 'slow-2g') {
          setIsSlowConnection(true);
        } else {
          setIsSlowConnection(false);
        }
      }
    };

    // Initial check
    checkConnectionSpeed();

    // Update on connection type change
    const handleConnectionChange = () => checkConnectionSpeed();
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    connection.addEventListener('change', handleConnectionChange);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      connection.removeEventListener('change', handleConnectionChange);
    };
  }, []);

  return (
    <div>
      {isSlowConnection && (
        <div className="notification">
          You have a slow internet connection. Some features may not work properly.
        </div>
      )}
    </div>
  );
};

export default InternetStatusNotification;
