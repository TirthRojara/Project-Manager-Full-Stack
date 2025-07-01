// const express = require('express')
import express from 'express';
import cors from 'cors';
import './db/mongoose.js';
// require('./db/mongoose')

// const userRouter = require('./routers/users')
// const taskRouter = require('./routers/tasks')
// const projectRouter = require('./routers/projects')


import userRouter from './routers/users.js';
import taskRouter from './routers/tasks.js';
import projectRouter from './routers/projects.js';

const app = express()

const corsOptions = {
    // origin: 'http://localhost:5173',
      origin: 'https://vercel-project-manager-frontend.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(projectRouter)


// module.exports = app

export default app;














