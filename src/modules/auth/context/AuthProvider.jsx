import { createContext, useState } from 'react';
import { login } from '../services/login';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return Boolean(token);
  });

  const signout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const signin = async (username, password) => {
    const { token, error } = await login(username, password);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', token);
    setIsAuthenticated(true);

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={ {
        isAuthenticated,
        signin,
        signout,
      } }
    >
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthProvider,
  AuthContext,
};
