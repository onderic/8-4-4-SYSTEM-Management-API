import { Request, Response } from "express";
import { Staff } from "../models/staff";
import { Department } from "../models/department";
import { DepartmentHeadHistory } from "../models/departmentHistory"


export const getDepartmentHistory = async (req: Request, res: Response) => {
    try {
      // Get the department ID from the request parameters
      const departmentId = req.params.id;
  
      // Find the department by its ID
      const department = await Department.findByPk(departmentId);
  
      if (!department) {
        return res.status(404).json({ error: "Department not found." });
      }
  
      // Fetch the department head history for the specified department
      const departmentHistory = await DepartmentHeadHistory.findAll({
        where: { departmentId },
        include: [Staff, Department],
      });
  
      res.status(200).json(departmentHistory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve department history." });
    }
  };
  