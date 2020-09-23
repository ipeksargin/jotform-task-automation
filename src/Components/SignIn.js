import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import {useAuth} from '../hooks/use-auth';

function SignIn() {
  const auth = useAuth();
  if (auth.user) {
    return (<Redirect to={{pathname: '/boards'}}/>);
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col text-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Jotform-logo-transparent-800x400.png"
            width="500" height="250"
            className="align-self-start mr-3"></img><br></br>
          <strong>Please sign in with your JotForm account.</strong>
          <br></br>
          <Link className="btn btn-secondary btn-lg"
            role="button" aria-disabled="true" onClick={auth.signin}>Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}


export default SignIn;
