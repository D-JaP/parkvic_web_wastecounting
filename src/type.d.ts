type tokenResponse = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    id_token: string;
    token_type: string;
}
interface AuthContextProps {
    isAuthenticate: boolean;
    user: User | null;
    updateUser: (user: User) => void;
    logout: () => void;
  }
  
interface User {
    username: string;
    email: string;
  }