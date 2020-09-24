
import React, {useState, useCallback, useEffect} from 'react';
import Head from './Head';
import List from './List';
import ListChild from './ListChild';
import {runGetRequestWithParams, runPostRequestWithParams} from '../Helper/APIHelper';
import {useParams} from 'react-router-dom';
import Image from '../imgg.jpg'; // Import using relative path


function Home() {
  const [todoTasks, setTodoTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [progressTasks, setProgressTasks] = useState([]);
  const [showtodoInput, setshowtodoInput] = useState(false);
  const [showprogressInput, setshowprogressInput] = useState(false);
  const [showdoneInput, setshowdoneInput] = useState(false);
  const [newTitle, setNewtitle] = useState('');
  const [mounted, setMounted] = useState(false);
  const [options, setOptions] = useState([]);
  const [statusID, setStatusID] = useState(null);

  const styles = {
    paperContainer: {
      backgroundImage: `url(${Image})`,
      height: '100vh',
    },
  };

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

    // console.log(options);
    console.log(statusID);

    const tasks = data.reduce((acc, i) => {
      if (!acc[i.answers[3].answer]) {
        acc[i.answers[3].answer] = [i.answers[3]];
      } else {
        acc[i.answers[3].answer].push([i.answers[3]]);
      }
      return acc;
    }, {});
    console.log(tasks);

    setDoneTasks(tasks.Done);
    setProgressTasks(tasks.Doing);
    setTodoTasks(tasks['To Do']);

    // setTodoTasks(todoTasks);
    // const progressTasks = items.filter((item) => item.status==='Doing');
  }, [boardid, statusID]);

  useEffect(() => {
    async function getFormQuestions() {
      const endPoint = `form/${boardid}/questions`;
      const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
      const response = await runGetRequestWithParams(endPoint, queryString);
      const responseContent = response.data.content;
      // console.log(responseContent);

      const boards = JSON.parse(localStorage.getItem('boards'));
      const questionBoard = boards.find((b) => b.id === boardid);
      // console.log(questionBoard);
      const statusID = questionBoard.mappings.status;
      // console.log(statusID);
      setStatusID(statusID);

      const options = responseContent[statusID].options;
      const optionsArr = options.split('|');
      // console.log(optionsArr);
      setOptions(optionsArr);
      setMounted(true);
      console.log(optionsArr);
    }
    if (!mounted) {
      getFormQuestions();
      getSubmissions();
    }
  }, [boardid, getSubmissions, mounted]);

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

  const setshowdone = useCallback((e) => {
    setshowdoneInput(true);
  }, []);

  const setshowtodo = useCallback((e) => {
    setshowtodoInput(true);
  }, []);

  const setshowprogress = useCallback((e) => {
    setshowprogressInput(true);
  }, []);

  const moveTask = useCallback(async (e) => {
    const taskStatus = e.currentTarget.getAttribute('data-status');
    console.log(taskStatus);
    const endPoint = `form/${boardid}/submissions`;
    const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
    const response = await runGetRequestWithParams(endPoint, queryString);

    const data = response.data.content;
    console.log(data);
  }, [boardid]);

  return (
    <div style={styles.paperContainer}>
      <div className="App">
        <Head />
        <div className="container">
          <div className="row">
            {options.map((option) =>{
              return (
                <div className="col-sm-4" key={option}>{}
                  <List name={option}>
                    <ListChild title="abc" description="xys"/>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={setshowtodo}
                        className="btn btn-dark mt-2"
                        data-option={option}
                      >
                      + ADD TASK
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
                  </List>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
