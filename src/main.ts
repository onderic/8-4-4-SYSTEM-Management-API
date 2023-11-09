import "reflect-metadata";
import express, { Request, Response } from "express";
import staffRoutes from './routes/staffRoutes';
import classRoutes from './routes/classRoutes';
import streamRoutes from './routes/streamRoutes';
import departmentRoutes from './routes/departmentRoutes';
import departmentHsRoutes from './routes/departmentHsRoutes';
import dataFetching from './routes/dataFetching';
import * as bodyParser from 'body-parser';
import connection from "../config/database";
import { Staff } from './models/staff'; 
import { Class } from './models/class';
import { Stream } from './models/stream';
import { Department } from './models/department';
import { DepartmentHeadHistory } from './models/departmentHistory';

const app = express();

app.use(bodyParser.json());

app.use('/api', staffRoutes);
app.use('/api', classRoutes);
app.use('/api', streamRoutes);
app.use('/api', departmentRoutes);
app.use('/api', departmentHsRoutes);
app.use('/api', dataFetching);

const start = async (): Promise<void> => {
  try {
    // Synchronize the model with the database to create the table
    // await Staff.sync({force:true}); 
    // await Class.sync();
    // await Department.sync({force:true});
    // await DepartmentHeadHistory.sync({force:true});
    // await Stream.sync({force:true});

    
    await connection.authenticate();
    console.log("Database connection has been established successfully.");

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error("Error while starting the server:", error);
    process.exit(1);
  }
};

app.get('/api', (req, res) => {
  res.send('Hello World!')
})

void start();
