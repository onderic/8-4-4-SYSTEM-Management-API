import "reflect-metadata";
import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import sequelize from "../config/database";
import staffRoutes from './routes/staffRoutes';
import classRoutes from './routes/classRoutes';
import streamRoutes from './routes/streamRoutes';
import departmentRoutes from './routes/departmentRoutes';
import dataFetching from './routes/dataFetching';
import subjectRouter from './routes/subjectRouter';
import examRouter from './routes/examRouter';
import userAuthRoutes from './routes/userAuthRoutes';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());

// Routes
app.use('/api/v1', staffRoutes);
app.use('/api/v1', classRoutes);
app.use('/api/v1', streamRoutes);
app.use('/api/v1', departmentRoutes);
app.use('/api/v1', dataFetching);
app.use('/api/v1', subjectRouter);
app.use('/api/v1', examRouter);
app.use('/api/v1', userAuthRoutes);

// Database connection and server start
const startServer = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database connection has been established successfully.");

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error while starting the server:", error);
    process.exit(1);
  }
};

void startServer();
