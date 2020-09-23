import React, {useState, useContext, createContext, useEffect} from 'react';
import {Redirect, Route, useHistory} from 'react-router-dom';


const authContext = createContext();
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({children}) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state

function useProvideAuth() {
  const [user, setUser] = useState(null);


  const history = useHistory();

  useEffect(()=> {
    if ('apiKey' in localStorage) {
      setUser(localStorage.getItem('apiKey'));
    }
  }, []);

  function success() {
    const loginKey = window.JF.getAPIKey();
    setUser(loginKey);
    console.log(loginKey);
    localStorage.setItem('apiKey', loginKey);
    history.push('/boards');
  }

  function error(...args) {
    console.log(args);
    console.log('error mesajı');
  }

  function signin() {
    window.JF.initialize({
      // can be "readOnly" or "full"
      // default: readOnly
      accessType: 'full',
    });
    window.JF.login(success, error);
  };

  function signout() {
    setUser(null);
    localStorage.clear(); // delete
    history.push('/');
  }

  // Return the user object and auth methods

  return {
    user,
    signin,
    signout,
  };
}

export function PrivateRoute({component: Component, ...rest}) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        auth.user ? (
      <Component {...props} /> ) : (
          <Redirect
            to={{
              pathname: '/',
            }}
          />
        )
      }
    />
  );
}
