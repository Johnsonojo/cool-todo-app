import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import "./App.css";
import Task from "./components/Task";
import { TaskContractAddress } from "./config";
import TaskAbi from "./utils/TaskContract.json";

const App = () => {
  const [uncompletedTasks, setUncompletedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const mainnetId = process.env.REACT_APP_ETH_MAIN_NETWORK_ID;
  const testnetId = process.env.REACT_APP_ETH_TEST_NETWORK_ID;

  const handleConnect = async () => {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(accounts[0]);

    let chainId = await window.ethereum.request({ method: "eth_chainId" });

    if (chainId === mainnetId || chainId === testnetId) {
      setCorrectNetwork(true);
    } else {
      alert("You are not connected to the Rinkeby Testnet!");
      setCorrectNetwork(false);
    }
  };

  const getTaskContract = async () => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const TaskContract = new ethers.Contract(
        TaskContractAddress,
        TaskAbi.abi,
        signer,
      );
      return TaskContract;
    } else {
      console.log("Ethereum object doesn't exist");
      return null;
    }
  };

  const getUncompletedTasks = async () => {
    try {
      const TaskContract = await getTaskContract();
      if (TaskContract) {
        const uncompletedTasks = await TaskContract.getMyUncompletedTasks();
        return uncompletedTasks;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCompletedTasks = async () => {
    try {
      const TaskContract = await getTaskContract();
      if (TaskContract) {
        const myCompletedTasks = await TaskContract.getMyCompletedTasks();
        return myCompletedTasks;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Promise.all([getUncompletedTasks(), getCompletedTasks()]).then(
      ([uncompletedTasks, completedTasks]) => {
        if (uncompletedTasks) {
          setUncompletedTasks(uncompletedTasks);
        }
        if (completedTasks) {
          setCompletedTasks(completedTasks);
        }
      },
    );
    // eslint-disable-next-line
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    let task = {
      taskText: taskInput,
      isDeleted: false,
    };

    try {
      const TaskContract = await getTaskContract();
      if (TaskContract) {
        try {
          await TaskContract.addTask(task.taskText, task.isDeleted);
          setUncompletedTasks([...uncompletedTasks, task]);
          console.log("Completed Task");
        } catch (err) {
          console.log("Error occurred while adding a new task");
        }
      }
    } catch (error) {
      console.log("Error submitting new Tweet", error);
    }

    setTaskInput("");
  };

  const deleteTask = (key) => async () => {
    try {
      const TaskContract = await getTaskContract();
      if (TaskContract) {
        await TaskContract.deleteTask(key, true);
        let allTasks = await TaskContract.getMyUncompletedTasks();
        setUncompletedTasks(allTasks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {currentAccount === "" ? (
        <button
          className="mb-10 rounded-lg bg-blue-500 px-12 py-3 text-2xl font-bold transition duration-500 ease-in-out hover:scale-105"
          onClick={handleConnect}
        >
          Connect Wallet
        </button>
      ) : correctNetwork ? (
        <div className="App">
          <h2> Task Management App</h2>
          <form>
            <TextField
              id="outlined-basic"
              label="Make Todo"
              variant="outlined"
              style={{ margin: "0px 5px" }}
              size="small"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={addTask}>
              Add Task
            </Button>
          </form>
          <div className="mt-10">
            <div>
              <h3>My Uncompleted Tasks</h3>
              <ul>
                {uncompletedTasks.map((item, index) => (
                  <Task
                    key={index}
                    taskText={item.taskText}
                    onClick={deleteTask(index)}
                  />
                ))}
              </ul>
            </div>

            <div>
              <h3>My Completed Tasks</h3>
              <ul>
                {completedTasks.map((item, index) => (
                  <Task
                    key={index}
                    taskText={item.taskText}
                    onClick={deleteTask(index)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-20 flex flex-col items-center justify-center gap-y-3 text-2xl font-bold">
          <div>----------------------------------------</div>
          <div>Please connect to the Goerli Testnet</div>
          <div>and reload the page</div>
          <div>----------------------------------------</div>
        </div>
      )}
    </div>
  );
};

export default App;
