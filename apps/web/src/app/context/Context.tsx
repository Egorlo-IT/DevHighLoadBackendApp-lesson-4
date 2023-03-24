import { createContext, Dispatch, SetStateAction, useEffect } from 'react';
import { useLocalStorage } from './use-localStorage';

type Props = {
  children: React.ReactNode;
};

type Context = {
  accessToken: string;
  setAccessToken: Dispatch<SetStateAction<string>>;
  authenticated: false;
  setAuthenticated: Dispatch<SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  setUser: Dispatch<SetStateAction<object>>;
};

const initialContext: Context = {
  accessToken: '',
  setAccessToken: (): void => {
    throw new Error('setContext function must be overridden');
  },
  authenticated: false,
  setAuthenticated: (): void => {
    throw new Error('setContext function must be overridden');
  },
  user: {},
  setUser: (): void => {
    throw new Error('setContext function must be overridden');
  },
};

export const AppContext = createContext<Context>(initialContext);

const AppContextProvider = ({ children }: Props): JSX.Element => {
  const [user, setUser] = useLocalStorage('user', {});
  const [authenticated, setAuthenticated] = useLocalStorage(
    'authenticated',
    false
  );
  const [accessToken, setAccessToken] = useLocalStorage('accessToken', '');

  useEffect(() => {
    if (!authenticated) localStorage.clear();
  }, [authenticated]);

  return (
    <AppContext.Provider
      value={{
        accessToken,
        setAccessToken,
        authenticated,
        setAuthenticated,
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
