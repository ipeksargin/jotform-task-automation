
import React, {useState, useCallback} from 'react';
import Head from './Head';
import List from './List';
import {runGetRequestWithParams, runPostRequestWithParams} from '../Helper/APIHelper';
import {useParams} from 'react-router-dom';

function Home() {
  const [items, setItems] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [progressTasks, setProgressTasks] = useState([]);
  const [showtodoInput, setshowtodoInput] = useState(false);
  const [showprogressInput, setshowprogressInput] = useState(false);
  const [showdoneInput, setshowdoneInput] = useState(false);
  const [newTitle, setNewtitle] = useState('');
  const {boardid} = useParams();

  // useEffect, mounted tricki ile, once formun questionlarini cek.
  // status question idsi mappingte var. onunla optionlari bul
  // orn (Planlanmamis|Calisilacak|Calisilan|Tamamlanmis|).split('|')
  // answerlari cek, ustte buldugun, optionlara gore grupla,

  const getSubmissions = useCallback(async () => {
    const endPoint = `form/${boardid}/submissions`;
    const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
    const response = await runGetRequestWithParams(endPoint, queryString);

    const data = response.data.content;
    console.log(data);

    // const items = [];
    // for (let i =0; i<data.length; i++) {
    //   const filterData = await filterDataByColumnConfs(data[i].answers);
    //   items.push(filterData);
    // }

    // console.log(items);
    // setItems(items);
    // const todoTasks = items.filter((item) => item.status==='To Do');
    // setTodoTasks(todoTasks);
    // const doneTasks = items.filter((item) => item.status==='Done');
    // setDoneTasks(doneTasks);
    // const progressTasks = items.filter((item) => item.status==='Doing');
    // setProgressTasks(progressTasks);
    // console.log(todoTasks);
    // setImportModal(false);
    // saveLocalStorage();
  }, [boardid]);

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
      const endpoint = `form/${boardid}/submissions`;
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
  }, [boardid, newTitle]);

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
    const endPoint = `form/${boardid}/submissions`;
    const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
    const response = await runGetRequestWithParams(endPoint, queryString);

    const data = response.data.content;
    console.log(data);
    // const items = [];
    // for (let i =0; i<data.length; i++) {
    //   const filterData = await filterDataByColumnConfs(data[i].answers);
    //   items.push(filterData);
    // }
    // console.log(items);

    // const myitem = items.find((i) => i.status === 'Doing');
    // console.log(myitem);
    // if (myitem.status === 'Doing') {
    //   return myitem.status === 'Done';
    // }
    // console.log(myitem);
  }, [boardid]);

  return (
    <div className="App">
      <Head />
      <div className="container">
        <div className="row">
          <div className="col-sm-4">
            <List name="To Do">
              <div className="text-center">
                <button
                  type="button"
                  onClick={setshowtodo}
                  className="btn btn-dark"
                >
                  + ADD TO DO TASK
                </button>
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
      </div>
    </div>
  );
}

export default Home;
