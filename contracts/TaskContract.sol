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

   function getMyTasks () public view returns (Task[] memory) {
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

function deleteTask(uint256 _taskId, bool _isDeleted) public {
   require(taskToOwner[_taskId] == msg.sender, "This task does not belong to you");
   tasks[_taskId].isDeleted = _isDeleted;
   emit DeleteTask(_taskId, _isDeleted);
}
}




// 1. `Task` is a data structure representing a single task, and `tasks` is an array that holds all the tasks in the contract.

// 2. The function starts by creating a temporary dynamic array called `temporary` of type `Task[] memory`. This array has the same size as the `tasks` array. It will be used to temporarily store tasks that belong to the caller.

// 3. The function also initializes a variable `counter` to keep track of how many tasks are being added to the `temporary` array.

// 4. The first loop (`for` loop) iterates through the `tasks` array, checking each task to see if it belongs to the caller (`msg.sender`) and whether the task is not marked as deleted (`isDeleted == false`).

// 5. If the conditions in the `if` statement are met, it means the current task belongs to the caller and is not deleted. In this case, the task is added to the `temporary` array, and the `counter` is incremented to keep track of the number of tasks added.

// 6. After the first loop, the `temporary` array contains all the tasks belonging to the caller, but it may have some extra empty slots at the end due to tasks that don't meet the criteria (e.g., tasks that belong to someone else or are deleted).

// 7. Now, a new dynamic array called `result` of type `Task[] memory` is created with a size equal to the `counter`. This array will store only the valid tasks that belong to the caller.

// 8. The second loop iterates through the `temporary` array, copying the valid tasks (excluding any empty slots) into the `result` array.

// 9. Finally, the function returns the `result` array, which contains all the tasks belonging to the caller, without any empty slots.

// In summary, the function scans through all tasks, filters out the ones owned by the caller and not deleted, and returns the filtered tasks in an array.