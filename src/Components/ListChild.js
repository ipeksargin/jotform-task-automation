import React, {useCallback} from 'react';
import PropTypes from 'prop-types';


function ListChild(props) {
  const handleDeleteTask = useCallback(() => {
    // console.log(props.status);
    // console.log(props.title);
    props.closeClick(props.id);
  }, [props]);

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{props.title}
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={handleDeleteTask}
                data-id={props.id}
                data-title={props.title}
                data-status={props.status}
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <button
                type="button"
                className="btn btn-outline-dark btn-sm ml-5"
                onClick={props.click}
                data-status={props.status}
                data-id={props.id}
              >Move</button></h5>
            <p className="card-text">{props.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

ListChild.propTypes = {
  'id': PropTypes.string.isRequired,
  'title': PropTypes.string.isRequired,
  'description': PropTypes.string.isRequired,
  'click': PropTypes.func.isRequired,
  'status': PropTypes.isRequired,
  'closeClick': PropTypes.func.isRequired,
};
export default ListChild;
