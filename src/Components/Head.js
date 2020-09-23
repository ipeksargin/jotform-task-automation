import React from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../hooks/use-auth';
import PropTypes from 'prop-types';


function Head(props) {
  const auth = useAuth();
  // console.log(auth);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="#">JotForm Task</a>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
        </ul>
        <form className="form-inline">
          <p className="text-white mt-3 mr-3">{props.username}</p>
          <Link className="btn btn-secondary btn-lg"
            role="button" aria-disabled="true" onClick={auth.signout}>Sign Out
          </Link>
        </form>
      </div>
    </nav>
  );
}

Head.propTypes = {
  'username': PropTypes.string.isRequired,
};
export default Head;
