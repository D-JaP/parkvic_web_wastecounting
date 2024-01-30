import { ReactNode, useState } from "react";
import { createContext } from "react";

export const AuthContext = createContext({} as AuthContextProps);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticate, setisAuthenticate] = useState(false);
  const [user, setuser] = useState<User | null>(null);

  const updateUser = (user: User) => {
    setuser(user);
    setisAuthenticate(true);
  };
  const logout = () => {
    setuser(null);
    setisAuthenticate(false);
  };
  

  return (
    <AuthContext.Provider value={{ isAuthenticate, user, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
