import chalk from 'chalk';
import { DB_PATH } from './constants.js';
import fs from 'fs/promises';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// const readTasks = () => {
//   return fs
//     .readFile(DB_PATH, 'utf-8')
//     .then(data => JSON.parse(data))
//     .catch(error => {
//       console.log(error);
//       return [];
//     });
// };

const readTasks = async () => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    console.log(chalk.red(error));
    return [];
  }
};

const writeTasks = async tasks => {
  await fs.writeFile(DB_PATH, JSON.stringify(tasks, null, 2));
};

// console.log(chalk.hex('#d6d963')('all users ==>'));

// console.log(await readTasks());

const getById = async id => {
  if (Number.isNaN(id)) {
    console.log(chalk.red('Id is required and must be a number'));
    return;
  }
  const tasks = await readTasks();

  const task = tasks.find(task => task.id === id);
  if (!task) {
    console.log(chalk.red(`user with such id: '${id}' doesn't exist`));
    return;
  }
  return task;
};

const addNewTask = async newTask => {
  if (newTask.trim() === '') {
    console.log('new task can not be empty');
    return;
  }
  const tasks = await readTasks();
  const id =
    (tasks.length === 0
      ? 1
      : tasks.reduce((acc, task) => {
          return task.id > acc ? task.id : acc;
        }, 0)) + 1;

  tasks.push({ title: newTask, id, completed: false });
  await writeTasks(tasks);
};

const deleteTask = async id => {
  if (Number.isNaN(id)) {
    console.log(chalk.red('Id is required and must be a number'));
    return;
  }
  const tasks = await readTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  await writeTasks(filteredTasks);
};

const updateTask = async (id, newTask) => {
  if (Number.isNaN(id)) {
    console.log(chalk.red('Id is required and must be a number'));
    return;
  }
  const tasks = await readTasks();
  const updatedTasks = tasks.map(task =>
    task.id === id ? { ...task, ...newTask } : task,
  );

  await writeTasks(updatedTasks);
};

yargs()
  .command(
    'list',
    'get all tasks',
    () => {},
    async argv => {
      const tasks = await readTasks();

      console.log(tasks);
    },
  )
  .command(
    'get',
    'get by id',
    () => {},
    async argv => {
      const task = await getById(Number(argv.id));
      console.log(task);
    },
  )
  .command(
    'add',
    'add a task',
    () => {},
    async argv => {
      await addNewTask(String(argv.title));
      console.log(argv.title);
    },
  )
  .command(
    'update',
    'update a task',
    () => {},
    async argv => {
      const newTask = {};
      if (argv.title !== undefined) newTask.title = argv.title;
      if (argv.completed !== undefined) newTask.completed = argv.completed;
      await updateTask(Number(argv.id), newTask);
      console.log(newTask);
    },
  )
  .command(
    'remove',
    'delete the task',
    () => {},
    argv => deleteTask(Number(argv.id)),
  )
  .help()
  .parse(hideBin(process.argv));
