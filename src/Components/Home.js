
import React, {useState, useEffect, useCallback} from 'react';
import {useLocation} from 'react-router-dom';
import Head from './Head';
import List from './List';
import {runGetRequestWithParams, runPostRequestWithParams} from '../Helper/APIHelper';

function Home() {
  const location = useLocation();

  const [importModal, setImportModal] = useState(true);
  const [formColums, setFormColums] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState([]);
  const [items, setItems] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [progressTasks, setProgressTasks] = useState([]);
  const [showtodoInput, setshowtodoInput] = useState(false);
  const [showprogressInput, setshowprogressInput] = useState(false);
  const [showdoneInput, setshowdoneInput] = useState(false);
  const [newTitle, setNewtitle] = useState('');


  const fromImport = location.state.importtanGeldi;
  const importedFormId = location.state.importedFormState;
  const importedFormName = location.state.importedFormName;

  // console.log(location.state);
  // console.log(importedFormId);

  function onClickCloseImportModal() {
    setImportModal(false);
  }

  useEffect(() => {
    if (!mounted) {
      checkBordConfInLocalStorage();
      getUserFormColums();
      setMounted(true);
    }
  }, [mounted]);

  function saveLocalStorage() {
    let boards = JSON.parse(localStorage.getItem('boards'));
    const board = {
      'id': importedFormId,
      'title': importedFormName,
      'mappings': {
        'description': config['columnConfs']['description'],
        'title': config['columnConfs']['title'],
        'status': config['columnConfs']['status'],
      },
    };
    console.log(config);
    if (boards) {
      const filteredBoards = boards.filter((b) => b.id === importedFormId);
      console.log(filteredBoards);
      if (filteredBoards.length < 1) {
        boards.push(board);
      }
    } else {
      boards = [];
      boards.push(board);
    }
    localStorage.setItem('boards', JSON.stringify(boards));
  }

  async function checkBordConfInLocalStorage() {
    const boardsLocalStorage = localStorage.getItem('boards');
    if (!boardsLocalStorage) {
      return;
    }
    const boards = JSON.parse(boardsLocalStorage);
    const board = boards.find((b) => b.id === importedFormId);
    if (board) {
      console.log(board);
      if (board.mappings) {
        const confs = 'columnConfs' in config ? config['columnConfs'] : config['columnConfs'] = [];
        const data = Object.keys(board.mappings);
        for (let i=0; i<data.length; i++) {
          confs[data[i]] = board.mappings[data[i]];
        }
        setConfig(confs);
        setImportModal(false);
        getSubmissions();
      }
    }
  }

  async function getUserFormColums() {
    const endPoint = `form/${importedFormId}/questions`;
    const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
    const response = await runGetRequestWithParams(endPoint, queryString);
    console.log(response.data);
    const colums = await convertJsonDataToArray(response.data.content);
    const filteredColums = colums.filter((c) => c.type != 'control_head' && c.type != 'control_button');
    // console.log(filteredColums);
    setFormColums(filteredColums);
  }

  async function convertJsonDataToArray(data) {
    const keys = Object.keys(data);
    const arr = [];
    for (let i =0; i<keys.length; i++) {
      arr.push(data[keys[i]]);
    }
    console.log(arr);
    return arr;
  }

  async function setColumnCofigration(boardKey, value) {
    console.log(boardKey);
    console.log(value);
    const confs = 'columnConfs' in config ? config['columnConfs'] : config['columnConfs'] = [];
    confs[boardKey] = value;
    console.log(confs);
  }

  async function filterDataByColumnConfs(data) {
    const columnConfs = config['columnConfs'];
    console.log(columnConfs);
    const item = {};
    const dataArr = await convertJsonDataToArray(data);
    // console.log( dataArr.filter((d) => d.name === columnConfs['status']));
    // To do : handle undefined answer
    item.status = dataArr.find((d) => d.name === columnConfs.status).answer;
    item.title = dataArr.find((d) => d.name === columnConfs.title).answer;
    item.description = dataArr.find((d) => d.name === columnConfs.description).answer;
    console.log(item);
    return item;
  }

  const getSubmissions = useCallback(async () => {
    const endPoint = `form/${importedFormId}/submissions`;
    const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
    const response = await runGetRequestWithParams(endPoint, queryString);

    const data = response.data.content;
    console.log(data);

    const items = [];
    for (let i =0; i<data.length; i++) {
      const filterData = await filterDataByColumnConfs(data[i].answers);
      items.push(filterData);
    }

    console.log(items);
    setItems(items);
    const todoTasks = items.filter((item) => item.status==='To Do');
    setTodoTasks(todoTasks);
    const doneTasks = items.filter((item) => item.status==='Done');
    setDoneTasks(doneTasks);
    const progressTasks = items.filter((item) => item.status==='Doing');
    setProgressTasks(progressTasks);
    console.log(todoTasks);
    setImportModal(false);
    saveLocalStorage();
  }, [importedFormId]);

  const addTaskSubmission = useCallback(async (e) => {
    try {
      const statusof = e.currentTarget.getAttribute('data-status');
      switch (statusof) {
        case 'To Do':
          setshowtodoInput(false);
          break;
        case 'Doing':
          setshowprogressInput(false);
          break;
        case 'Done':
          setshowdoneInput(false);
          break;
      }
      const endpoint = `form/${importedFormId}/submissions`;
      const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
      let data = new FormData();
      data = {
        '3': statusof,
        '4': newTitle,
        '5': ' ',
      };
      const response = await runPostRequestWithParams(endpoint, queryString, data);
      console.log(response);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }, [importedFormId, newTitle]);

  function setshowdone() {
    setshowdoneInput(true);
  }
  function setshowtodo() {
    setshowtodoInput(true);
  }
  function setshowprogress() {
    setshowprogressInput(true);
  }

  const moveTask = useCallback(async (e) => {
    const taskStatus = e.currentTarget.getAttribute('data-status');
    console.log(taskStatus);
    const endPoint = `form/${importedFormId}/submissions`;
    const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
    const response = await runGetRequestWithParams(endPoint, queryString);

    const data = response.data.content;
    console.log(data);
    const items = [];
    for (let i =0; i<data.length; i++) {
      const filterData = await filterDataByColumnConfs(data[i].answers);
      items.push(filterData);
    }
    console.log(items);

    const myitem = items.find((i) => i.status === 'Doing');
    console.log(myitem);
    if (myitem.status === 'Doing') {
      return myitem.status === 'Done';
    }
    console.log(myitem);
  }, []);

  return (
    <div className="App">
      <Head />
      <div className="container">
        {
            fromImport ?
            (
              importModal ? (
                <div className="modal d-block" id="staticBackdrop"
                  data-backdrop="static" data-keyboard="false" tabIndex="-1"
                  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Choose Form Attributes</h5>
                        <button type="button" className="close"
                          onClick={onClickCloseImportModal} data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>Task Status: </p>
                        <div className="btn-group btn-group-sm">
                          {(formColums.map((col) => <button key={col.name} type="button" onClick={()=>{
                            setColumnCofigration('status', col.name);
                          }} className="btn btn-primary ml-2">{col.text}</button>))}
                        </div>
                        <p>Task Title: </p>
                        <div className="btn-group btn-group-sm">
                          {(formColums.map((col) => <button key={col.name} type="button" onClick={()=>{
                            setColumnCofigration('title', col.name);
                          }} className="btn btn-primary ml-2">{col.text}</button>))}
                        </div>
                        <p>Task Description: </p>
                        <div className="btn-group btn-group-sm">
                          {(formColums.map((col) => <button key={col.name} type="button" onClick={()=>{
                            setColumnCofigration('description', col.name);
                          }} className="btn btn-primary ml-2">{col.text}</button>))}
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" onClick={onClickCloseImportModal}
                          className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" onClick={getSubmissions} className="btn btn-primary">Continue</button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                (
              <div className="row">
                <div className="col-sm-4">
                  <List name="To do">
                    {todoTasks.map((item) => {
                      return (
                        <div className="col" key={item.name}>
                          <div className="card">
                            <div className="card-body">
                              <h5 className="card-title">{item.title}
                                <button type="button"
                                  data-status="To Do"
                                  onClick={moveTask}
                                  className="btn btn-outline-dark btn-sm ml-5">Move</button>
                              </h5>
                              <p className="card-text">{item.description}</p>
                            </div>
                          </div>
                        </div>);
                    })}
                  </List>
                </div>
                <div className="col-sm-4">
                  <List name="In Progress">
                    {progressTasks.map((item) => {
                      return (
                        <div className="col" key={item.name}>
                          <div className="card">
                            <div className="card-body">
                              <h5 className="card-title">{item.title}
                                <button type="button"
                                  data-status="Doing"
                                  onClick={moveTask}
                                  className="btn btn-outline-dark btn-sm ml-5">Move</button>
                              </h5>
                              <p className="card-text">{item.description} </p>
                            </div>
                          </div>
                        </div>);
                    })}
                  </List>
                </div>
                <div className="col-sm-4">
                  <List name="Done">
                    {doneTasks.map((item) => {
                      return (
                        <div className="col" key={item.name}>
                          <div className="card">
                            <div className="card-body">
                              <h5 className="card-title">{item.title}
                                <button type="button"
                                  data-status="Done"
                                  onClick={moveTask}
                                  className="btn btn-outline-dark btn-sm ml-5">Move</button>
                              </h5>
                              <p className="card-text">{item.description}</p>
                            </div>
                          </div>
                        </div>);
                    })}
                  </List>
                </div>
              </div>
            ))) : ( // create ile yönlendirilen
                    <div className="row">
                      <div className="col-sm-4">
                        <List name="To Do">
                          <div className="text-center">
                            <button type="button" onClick={setshowtodo}
                              className="btn btn-dark">+ ADD TO DO TASK</button>
                          </div>
                          <div>
                            {showtodoInput && (
                              <div className="input-group mt-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Task Title"
                                  aria-describedby="button-addon2"
                                  onChange={(event) =>
                                    setNewtitle(event.target.value)
                                  }></input>
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    name="title"
                                    data-status="To Do"
                                    onClick={addTaskSubmission}
                                    id="button-addon2"
                                  >Add</button>
                                </div>
                              </div>)
                            }
                          </div>
                          {todoTasks.map((item) => {
                            return (
                              <div className="col" key={item.name}>
                                <div className="card">
                                  <div className="card-body">
                                    <div className="col">
                                      <h5 className="card-title">{item.title}</h5>
                                      <p className="card-text">{item.description}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </List>
                      </div>
                      <div className="col-sm-4">
                        <List name="In Progress">
                          <div className="text-center">
                            <button type="button" className="btn btn-dark"
                              onClick={setshowprogress}>+ ADD PROGRESS TASK</button>
                          </div>
                          <div>
                            {showprogressInput && (
                              <div className="input-group mt-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Task Title"
                                  onChange={(event) =>
                                    setNewtitle(event.target.value)
                                  }
                                  aria-describedby="button-addon2"></input>
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    id="button-addon2"
                                    data-status="Doing"
                                    onClick={addTaskSubmission}
                                  >Add</button>
                                </div>
                              </div>)
                            }
                          </div>
                          {progressTasks.map((item) => {
                            return (
                              <div className="col" key={item.name}>
                                <div className="card">
                                  <div className="card-body">
                                    <h5 className="card-title">{item.title}</h5>
                                    <p className="card-text">{item.description}</p>
                                  </div>
                                </div>
                              </div>);
                          })}
                        </List>
                      </div>
                      <div className="col-sm-4">
                        <List name="Done">
                          <div className="text-center">
                            <button type="button" className="btn btn-dark"
                              onClick={setshowdone}>+ ADD DONE TASK</button>
                          </div>
                          <div>
                            {showdoneInput && (
                              <div className="input-group mt-3">
                                <input type="text"
                                  className="form-control"
                                  placeholder="Task Title"
                                  onChange={(event) =>
                                    setNewtitle(event.target.value)
                                  }
                                  aria-describedby="button-addon2"></input>
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={addTaskSubmission}
                                    id="button-addon2"
                                    data-status="Done">Add</button>
                                </div>
                              </div>)
                            }
                          </div>
                          {doneTasks.map((item) => {
                            return (
                              <div className="col" key={item.name}>
                                <div className="card">
                                  <div className="card-body">
                                    <h5 className="card-title">{item.title}</h5>
                                    <p className="card-text">{item.description}</p>
                                  </div>
                                </div>
                              </div>);
                          })}
                        </List>
                      </div>
                    </div>
            )}
      </div>
    </div>
  );
}

export default Home;
