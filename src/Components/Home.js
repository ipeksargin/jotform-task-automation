
import React, {useState, useCallback, useEffect} from 'react';
import Head from './Head';
import List from './List';
import {runGetRequestWithParams, runPostRequestWithParams} from '../Helper/APIHelper';
import {useParams} from 'react-router-dom';
import Image from '../imgg.jpg'; // Import using relative path


function Home() {
  const [tasks, setTasks] = useState({});
  const [mounted, setMounted] = useState(false);
  const [options, setOptions] = useState([]);
  const [statusID, setStatusID] = useState(null);
  const [mappings, setMappings] = useState({});


  const styles = {
    paperContainer: {
      backgroundImage: `url(${Image})`,
      height: '100vh',
    },
  };

  const {boardid} = useParams();
  const getSubmissions = useCallback(async (_status) => {
    const endPoint = `form/${boardid}/submissions`;
    const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
    const response = await runGetRequestWithParams(endPoint, queryString);

    const data = response.data.content;
    // console.log(data);

    console.log(_status);

    const tasks = data.reduce((acc, i) => {
      if (!acc[i.answers[_status].answer]) {
        acc[i.answers[_status].answer] = [i.answers];
      } else {
        acc[i.answers[_status].answer].push(i.answers);
      }
      return acc;
    }, {});

    setTasks(tasks);
    console.log(tasks);

    // const progressTasks = items.filter((item) => item.status==='Doing');
  }, [boardid]);

  const getFormQuestions = useCallback(async () => {
    const endPoint = `form/${boardid}/questions`;
    const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
    const response = await runGetRequestWithParams(endPoint, queryString);
    const responseContent = response.data.content;
    // console.log(responseContent);

    const boards = JSON.parse(localStorage.getItem('boards'));
    const board = boards.find((b) => b.id === boardid);
    // console.log(board);
    const _status = board.mappings.status;
    // console.log(statusID);
    setStatusID(_status);
    setMappings(board.mappings);
    console.log(mappings.status);


    const options = responseContent[_status].options;
    const optionsArr = options.split('|');
    // console.log(optionsArr);
    setOptions(optionsArr);
    setMounted(true);
    return _status;
    // console.log(optionsArr);
  }, [boardid, mappings]);


  useEffect(() => {
    async function getBoardData() {
      const statusID = await getFormQuestions();
      await getSubmissions(statusID);
    }
    if (!mounted) {
      getBoardData();
    }
  }, [getFormQuestions, getSubmissions, mounted]);

  const addNewTask = useCallback(async (status, title) => {
    try {
      const endpoint = `form/${boardid}/submissions`;
      const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
      let data = new FormData();
      data = {};
      data[mappings.status] = status;
      data[mappings.title] = title;
      const response = await runPostRequestWithParams(endpoint, queryString, data);
      console.log(response);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }, [boardid, mappings.status, mappings.title]);

  const moveTask = useCallback(async (e) => {
    const taskStatus = e.currentTarget.getAttribute('data-status');
    console.log(taskStatus);
    // const endPoint = `form/${boardid}/submissions`;
    // const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
    //  const response = await runGetRequestWithParams(endPoint, queryString);

    // const data = response.data.content;
    // console.log(data);
  }, []);

  return (
    <div style={styles.paperContainer}>
      <div className="App">
        <Head />
        <div className="container">
          <div className="row">
            {options.map((option) =>{
              return (
                <div className="col-sm-4" key={option}>
                  <List
                    name={option}
                    tasks={tasks[option] || []}
                    mappings={mappings}
                    onMoveTask={moveTask}
                    onAddNewTask={addNewTask}
                  />
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
