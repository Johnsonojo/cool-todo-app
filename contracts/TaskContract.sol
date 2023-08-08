// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TaskContract {
   event AddTask(address recipient, uint taskId);
   event DeleteTask(uint taskId, bool isDeleted);

   struct Task {
      uint id;
      string taskText;
      bool isDeleted;
   }

   Task[] private tasks;

   mapping(uint256 => address) private taskToOwner;

   function addTask(string memory _taskText, bool _isDeleted) public {
      uint256 taskId = tasks.length;
      tasks.push(Task(taskId, _taskText, _isDeleted));
      taskToOwner[taskId] = msg.sender;
      emit AddTask(msg.sender, taskId);
   }

   function getMyUncompletedTasks () public view returns (Task[] memory) {
      Task[] memory temporary = new Task[](tasks.length);
      uint256 counter = 0;
      for (uint i = 0; i < tasks.length; i++) {
         if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
            temporary[counter] = tasks[i];
            counter++;
         }
      }
      Task[] memory result = new Task[](counter);
      for (uint i = 0; i < counter; i++) {
         result[i] = temporary[i];
      }
      return result;
   }

function getMyCompletedTasks() public view returns (Task[] memory) {
   Task[] memory temporary = new Task[](tasks.length);
   uint256 counter = 0;
   for (uint i = 0; i < tasks.length; i++) {
      if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == true) {
         temporary[counter] = tasks[i];
         counter++;
      }
   }
   Task[] memory result = new Task[](counter);
   for (uint i = 0; i < counter; i++) {
      result[i] = temporary[i];
   }
   return result;
}

function deleteTask(uint256 _taskId, bool _isDeleted) public {
   require(taskToOwner[_taskId] == msg.sender, "This task does not belong to you");
   tasks[_taskId].isDeleted = _isDeleted;
   emit DeleteTask(_taskId, _isDeleted);
}
}


// 9. Finally, the function returns the `result` array, which contains all the tasks belonging to the caller, without any empty slots.

// In summary, the function scans through all tasks, filters out the ones owned by the caller and not deleted, and returns the filtered tasks in an array.