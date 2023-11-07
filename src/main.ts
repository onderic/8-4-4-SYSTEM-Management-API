import "reflect-metadata";
import express, { Request, Response } from "express";
import staffRoutes from './routes/staffRoutes';
import * as bodyParser from 'body-parser';
import connection from "../config/database";
import { Staff } from './models/staff'; // Import your Dog model

const app = express();

app.use(bodyParser.json());

app.use('/api', staffRoutes);

const start = async (): Promise<void> => {
  try {
    // Synchronize the model with the database to create the table
    await Staff.sync(); 
    
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

void start();
