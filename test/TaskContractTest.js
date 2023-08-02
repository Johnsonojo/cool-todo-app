const { expect } = require("chai");

describe("Task Contract", function () {
  let TaskContract;
  let taskContract;
  let owner;

  const NUM_OF_TOTAL_TASKS = 5;
  let totalTasks;

  before(async () => {
    TaskContract = await ethers.getContractFactory("TaskContract");
    [owner] = await ethers.getSigners();
    taskContract = await TaskContract.deploy();

    totalTasks = [];

    for (let i = 0; i < NUM_OF_TOTAL_TASKS; i++) {
      let task = {
        taskText: "Task number: " + i,
        isDeleted: false,
      };
      await taskContract.addTask(task.taskText, task.isDeleted);
      totalTasks.push(task);
    }
  });

  describe("Add Task", function () {
    it("should emit AddTask event", async () => {
      let task = {
        taskText: "New task",
        isDeleted: false,
      };
      await expect(await taskContract.addTask(task.taskText, task.isDeleted))
        .to.emit(taskContract, "AddTask")
        .withArgs(owner.address, NUM_OF_TOTAL_TASKS);
    });
  });

  describe("Get all tasks", function () {
    it("should return all tasks for a user", async () => {
      const tasksFromChain = await taskContract.getMyTasks();
      expect(tasksFromChain.length).to.equal(NUM_OF_TOTAL_TASKS + 1);
    });
  });

  describe("Delete task", function () {
    it("should emit DeleteTask event", async () => {
      const taskIndex = 0;
      const isDeleted = true;
      await expect(await taskContract.deleteTask(taskIndex, isDeleted))
        .to.emit(taskContract, "DeleteTask")
        .withArgs(taskIndex, isDeleted);
    });
  });
});
