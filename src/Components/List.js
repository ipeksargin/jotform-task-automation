import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import ListChild from './ListChild';

function List(props) {
  const [newTitle, setNewtitle] = useState('');

  // console.log(props.mappings);

  const handleTitleChange = useCallback((e) => {
    setNewtitle(e.target.value);
  }, []);

  const handleNewTaskClick = useCallback(() => {
    props.onAddNewTask(props.name, newTitle);
  }, [newTitle, props]);


  return (
    <div className="row">
      <div className="col-md">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center text-uppercase">{props.name}</h5>
            {
              props.tasks.map((task) => {
                return (
                  <ListChild
                    key={task.id}
                    title={task[props.mappings.title].answer}
                    description={task[props.mappings.description].answer}
                    click={props.onMoveTask}
                    status={task[props.mappings.status].answer}
                  />);
              })
            }
            <div>
              <div className="input-group mt-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="New Task Title"
                  aria-describedby="button-addon2"
                  onChange={handleTitleChange}></input>
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    name="title"
                    data-status={props.name}
                    onClick={handleNewTaskClick}
                    id="button-addon2"
                  >Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

List.propTypes = {
  'name': PropTypes.string.isRequired,
  'children': PropTypes.arrayOf(PropTypes.node),
  'onMoveTask': PropTypes.func.isRequired,
  'onTitleChange': PropTypes.func.isRequired,
  'onAddNewTask': PropTypes.func.isRequired,
  'tasks': PropTypes.array,
  'mappings': PropTypes.shape,
};
export default List;

