import React, {useCallback, useEffect, useState} from 'react';
import Head from './Head';
import axios from 'axios';
import {useAuth} from '../hooks/use-auth';
import {useHistory} from 'react-router-dom';
import {runGetRequestWithParams} from '../Helper/APIHelper';
import Image from '../imgg.jpg'; // Import using relative path
import FormSelector from './FormSelector';


const styles = {
  paperContainer: {
    backgroundImage: `url(${Image})`,
    height: '100vh',
  },
};


function Boards() {
  const [showExistingModal, setModal] = useState(false);
  const [showNewModal, setNewModal] = useState(false);
  const [forms, setForms] = useState([]);
  const [title, setTitle] = useState('');
  const [boards, setBoards] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState('');


  const auth = useAuth();
  const history = useHistory();

  useEffect(() => {
    async function getUserDetails() {
      const endPoint = 'user';
      const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
      const response = await runGetRequestWithParams(endPoint, queryString);
      // console.log(response.data.content.name);
      setUsername(response.data.content.name);
      setMounted(true);
    }
    if (!mounted) {
      getUserDetails();
      const nextBoards = JSON.parse(localStorage.getItem('boards'));
      // console.log(nextBoards);
      setBoards(nextBoards || []);
    }
  }, [mounted]);

  const handleNewClick = useCallback(async (e) => {
    const apiKey = auth.user;
    try {
      const data = new FormData();
      data.append('title', title);
      const response = await axios.post(`https://api.jotform.com/form/202601638528050/clone?apiKey=${apiKey}`, data);
      console.log(response.data);
      const mappings = {
        description: 5,
        title: 4,
        status: 3,
      };
      const values = {
        title: response.data.content.title,
        id: response.data.content.id,
        mappings: mappings,
      };
      let boardArr = [];
      if ('boards' in localStorage) {
        boardArr = JSON.parse(localStorage.getItem('boards'));
      }
      boardArr.push(values);
      localStorage.setItem('boards', JSON.stringify(boardArr));
      history.push(`/boards/${response.data.content.id}`);
    } catch (e) {
      console.log(e);
    }
  },
  [auth.user, title, history]);


  const handleExistingClick = useCallback(async (e) => {
    const apiKey = auth.user;
    try {
      const response = await axios.get(`https://api.jotform.com/user/forms?apiKey=${apiKey}`);
      setForms(response.data.content);
      setModal(true);
    } catch (e) {
      console.log(e);
    }
  },
  [auth.user]);

  function setNewFalse() {
    setNewModal(false);
  }

  function onNewButtonClick() {
    setNewModal(true);
  }

  function closeExistingModal() {
    setModal(false);
  }

  function onclickComponent(e) {
    const componentFromID = e.target.getAttribute('id');
    // console.log(componentFromID);
    history.push(`boards/${componentFromID}`);
  }

  const handleBoardSave = useCallback((configuration) => {
    let boards = JSON.parse(localStorage.getItem('boards'));
    if (!boards) {
      boards = [];
    }

    const form = forms.find((form) => {
      return form.id === configuration.formID;
    });

    if (!form) {
      window.alert('Unable to find form: ' + configuration.formID);
      return;
    }

    boards.push({title: form.title, id: configuration.formID, mappings: configuration.mappings});

    localStorage.setItem('boards', JSON.stringify(boards));

    history.push(`/boards/${configuration.formID}`);
  }, [forms, history]);

  const handledeleteBoard = useCallback((e) => {
    const boardID = e.currentTarget.getAttribute('board-id');
    // const boardTitle = e.currentTarget.getAttribute('board-title');
    // console.log(boardID);
    setBoards(boards.filter((b) => b.id !== boardID));
  }, [boards]);

  if (!mounted) {
    return null;
  }
  return (
    <div style={styles.paperContainer}>
      <Head username={username}/>
      <div className="container">
        {
          showNewModal && (
            <div className="modal d-block" id="myNewModal" tabIndex="-1" role="dialog"
              aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Create New Board</h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={setNewFalse}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label htmlFor="message-text" className="col-form-label">Enter Form Title</label>
                        <textarea
                          className="form-control"
                          id="message-text"
                          onChange={(event) => setTitle(event.target.value)}
                        ></textarea>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                      onClick={setNewFalse}>Close</button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNewClick}>Next</button>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        {
          showExistingModal && (
            <FormSelector
              forms={forms}
              onSave={handleBoardSave}
              closeExistingModal={closeExistingModal}
            />
          )
        }
        <div className="row">
          <div className="card mt-5">
            <div className="card-header">Create New Board</div>
            <div className="card-body">
              <p className="card-text">Choose the form to create a new board.</p>
              <button
                type="button"
                className="btn btn-secondary"
                data-target="#myNewModal"
                data-toggle="modal"
                onClick={onNewButtonClick}
              >
                Create New Form
              </button>
              <button
                type="button"
                className="btn btn-secondary ml-2"
                data-target="#myExistingModal"
                data-toggle="modal"
                onClick={handleExistingClick}
              >
                Import From JotForm
              </button>
            </div>
          </div>
          {
            boards.map((board) =>
              <div className="card mt-5 ml-3" key={board.id}>
                <button type="button" className="btn btn">
                  <button type="button"
                    board-id={board.id}
                    board-title={board.title}
                    className="close"
                    onClick={handledeleteBoard}
                    aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <div className="card-body">
                    <h5 className="card-title" >{board.title}</h5>
                    <p className="card-text"></p>
                    <button
                      id={board.id}
                      onClick={onclickComponent}
                      className="btn btn-secondary">Go to Board</button>
                  </div>
                </button>
              </div>,
            )}
        </div>
      </div>
    </div>
  );
}

export default Boards;
