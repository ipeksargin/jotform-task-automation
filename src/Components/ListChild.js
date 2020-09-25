import React from 'react';
import PropTypes from 'prop-types';


function ListChild(props) {
  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{props.title}
              <button
                type="button"
                className="btn btn-outline-dark btn-sm ml-5"
                onClick={props.click}
                data-status={props.status}
              >Move Task</button></h5>
            <p className="card-text">{props.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

ListChild.propTypes = {
  'title': PropTypes.string.isRequired,
  'description': PropTypes.string.isRequired,
  'click': PropTypes.func.isRequired,
  'status': PropTypes.isRequired,
};
export default ListChild;
