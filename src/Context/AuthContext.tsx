import { ReactNode, useState } from "react";
import { createContext } from "react";

interface User {
  username: string;
  email: string;
}

interface AuthContextProps {
  isAuthenticate: boolean;
  user: User | null;
}

export const AuthContext = createContext({} as AuthContextProps);

interface AuthProviderProps {
  children: ReactNode;
}

 const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticate, setisAuthenticate] = useState(false);
  const [user, setuser] = useState<User | null>(null);
  const contextValue: AuthContextProps = {
    isAuthenticate,
    user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
