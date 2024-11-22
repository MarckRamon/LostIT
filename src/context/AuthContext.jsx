import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log("Setting user data in context:", userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    console.log("Updating user data in context:", userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        updateUser,
        isAuthenticated: !!user,
        loading 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);