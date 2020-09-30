
import React, {useState, useCallback, useEffect, useMemo} from 'react';
import Head from './Head';
import List from './List';
import {runGetRequestWithParams, runPostRequestWithParams, runDeleteRequestWithParams} from '../Helper/APIHelper';
import {useParams} from 'react-router-dom';
import Image from '../imgg.jpg';


function Home() {
  const [mounted, setMounted] = useState(false);
  const [options, setOptions] = useState([]);
  const [statusID, setStatusID] = useState(null);
  const [mappings, setMappings] = useState({});
  const [submissions, setSubmissions] = useState([]);


  const styles = {
    paperContainer: {
      backgroundImage: `url(${Image})`,
      height: '100vh',
    },
  };

  const {boardid} = useParams();

  const getSubmissions = useCallback(async () => {
    const endPoint = `form/${boardid}/submissions`;
    const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
    const response = await runGetRequestWithParams(endPoint, queryString);

    setSubmissions(response.data.content);
    console.log(response.data.content);
  }, [boardid]);

  const getFormQuestions = useCallback(async () => {
    const endPoint = `form/${boardid}/questions`;
    const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
    const response = await runGetRequestWithParams(endPoint, queryString);
    const questions = response.data.content;

    const boards = JSON.parse(localStorage.getItem('boards'));
    const board = boards.find((b) => b.id === boardid);

    const _status = board.mappings.status;
    // console.log(statusID);
    setStatusID(_status);
    setMappings(board.mappings);
    console.log(board.mappings.status);

    console.log(_status);
    const options = questions[_status].options;
    const optionsArr = options.split('|');
    // console.log(optionsArr);
    setOptions(optionsArr);
    setMounted(true);
    return _status;
    // console.log(optionsArr);
  }, [boardid]);


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
      // console.log(data);
      // console.log(tasks);
      const submissionID = response.data.content.submissionID;
      const endp = `submission/${submissionID}`;
      const respons = await runGetRequestWithParams(endp, queryString);
      const sub = respons.data.content;
      setSubmissions([...submissions, sub]);
    } catch (e) {
      console.log(e);
    }
  }, [boardid, mappings.status, mappings.title, submissions]);

  const deleteTask = useCallback(async (id) => {
    try {
    // console.log(responseData);
      const endpoint = `submission/${id}`;
      const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
      const response = await runDeleteRequestWithParams(endpoint, queryString);
      setSubmissions(submissions.filter((s) => s.id !== id));
    // console.log(response);
    } catch (e) {
      console.log(e);
    }
  }, [submissions]);

  const tasks = useMemo(() => {
    return options.reduce((acc, option) => {
      if (!acc[option]) {
        acc[option] = [];
      }
      acc[option] = submissions.filter((s) => {
        return s.answers[mappings.status].answer === option;
      });
      return acc;
    },
    {});
  }, [mappings, options, submissions]);
  console.log(tasks);

  const moveTask = useCallback(async (e) => {
    try {
      const taskID = e.currentTarget.getAttribute('data-id');
      const taskStatus = e.currentTarget.getAttribute('data-status');

      const endpoint = `submission/${taskID}`;
      const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
      console.log(options); // To do doing done
      const x = options.indexOf(taskStatus);
      let submissionData = new FormData();
      submissionData = {};
      if ((x % options.length === 0) || (x % options.length === 1)) {
        submissionData[mappings.status] = options[x + 1];
      } else {
        submissionData[mappings.status] = options[0];
      }
      const response = await runPostRequestWithParams(endpoint, queryString, submissionData);
      // console.log(submissionData);

      setSubmissions(submissions.map((s) => {
        if (s.id === taskID) {
          if ((x % options.length === 0) || (x % options.length === 1)) {
            s.answers[mappings.status].answer = options[x + 1];
          } else {
            s.answers[mappings.status].answer = options[0];
          }
        }
        return s;
      }));
      console.log(tasks);
    } catch (e) {
      console.log(e);
    }
  }, [mappings.status, options, submissions, tasks]);


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
                    tasks={tasks[option]}
                    mappings={mappings}
                    onMoveTask={moveTask}
                    onAddNewTask={addNewTask}
                    onDeleteTask={deleteTask}
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
