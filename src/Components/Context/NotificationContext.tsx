import React, { createContext, useContext, useState } from 'react';

interface NotificationContextType {
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export default function  NotificationProvider({children} : {children : React.ReactNode}) 
  {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationCount = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotificationCount must be used within a NotificationProvider");
  return context;
};
