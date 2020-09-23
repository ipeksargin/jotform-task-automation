import React from 'react';
import PropTypes from 'prop-types';

function List(props) {
  return (
    <div className="row">
      <div className="col-md">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center text-uppercase">{props.name}</h5>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}

List.propTypes = {
  'name': PropTypes.string.isRequired,
  'children': PropTypes.arrayOf(PropTypes.node),
};
export default List;

