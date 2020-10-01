import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import ListChild from './ListChild';
import {Draggable} from 'react-beautiful-dnd';

function List(props) {
  const [newTitle, setNewtitle] = useState('');
  const [placeholder, setPlaceholder] = useState('New Form Title');

  // console.log(props.mappings);

  const handleTitleChange = useCallback((e) => {
    setNewtitle(e.target.value);
    console.log(e.target.placeholder);
  }, []);

  const handleNewTaskClick = useCallback(async () => {
    await props.onAddNewTask(props.name, newTitle);
    setPlaceholder('New Form Title');
  }, [newTitle, props]);

  return (
    <div className="row">
      <div className="col-md">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center text-uppercase">{props.name}</h5>
            {
              props.tasks.map((task, index) => {
                return (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => {
                      return (
                        <div ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ListChild
                            key={task.id}
                            id={task.id}
                            title={task.answers[props.mappings.title].answer}
                            description={task.answers[props.mappings.description].answer}
                            click={props.onMoveTask}
                            status={task.answers[props.mappings.status].answer}
                            closeClick={props.onDeleteTask}
                          />
                        </div>
                      );
                    }}
                  </Draggable>);
              })
            }
            <div>
              <div className="input-group mt-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder={placeholder}
                  aria-describedby="button-addon2"
                  onChange={handleTitleChange}
                ></input>
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
  'onDeleteTask': PropTypes.func.isRequired,
};
export default List;

