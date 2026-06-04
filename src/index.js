import chalk from 'chalk';
import { DB_PATH } from './constants.js';
import fs from 'fs/promises';

const readTasks = async () => {
  return await fs.readFile(DB_PATH, 'utf-8').then(data => JSON.parse(data));
};

const writeTasks = async tasks => {
  await fs.writeFile(DB_PATH, JSON.stringify(tasks, null, 2));
};

console.log(chalk.hex('#d6d963')('all users ==>'));

console.log(await readTasks());

const getById = async id => {
  const tasks = await readTasks();
  const task = tasks.find(task => task.id === id);
  if (!task) {
    console.log(chalk.red(`user with such id: '${id}' doesn't exist`));
    return;
  }
  return task;
};

console.log(chalk.hex('#d6d963')('get by Id 4 ==>'));
console.log(await getById(4));

const addNewTask = async newTask => {
  const tasks = await readTasks();
  tasks.push(newTask);
  await writeTasks(tasks);
};

await addNewTask({ id: 200, title: 'test', complited: true });

console.log(chalk.hex('#d6d963')('add new item with id 200 ==>'));

console.log(await readTasks());

const deleteTask = async id => {
  const tasks = await readTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  await writeTasks(filteredTasks);
};

await deleteTask(200);
console.log(chalk.hex('#d6d963')('tasks after deleting task with the id 200'));
console.log(await readTasks());

const updateTask = async (id, newTask) => {
  const task = await getById(id);
  if (!task) return;
  await deleteTask(id);
  const tasks = await readTasks();

  const updatedTask = { ...task, ...newTask };
  tasks.push(updatedTask);
  await writeTasks(tasks);
};

await updateTask(15, { completed: true });
