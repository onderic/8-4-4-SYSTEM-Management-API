import { Request, Response } from "express";
import { Staff } from "../models/staff";
import { Class } from "../models/class";
import { Stream } from "../models/stream";
import { Department } from "../models/department";  
import { DepartmentHeadHistory } from "../models/departmentHistory";  

export const classesInfomation = async (req: Request, res: Response) => {
    try {
        const staffList = await Class.findAll({
          include: [
            {
              model: Staff,
              as: 'head',
              attributes: ['name', 'number'],
            },
            {
              model: Stream,
              attributes: ['name', 'abbreviation'],
              include: [
                {
                  model: Staff,
                  as: 'staff',
                  attributes: ['name', 'number'],
                },
              ],
            },
          ],
        });
    
        res.status(200).json(staffList);
      } catch (error) {
        console.error("Error fetching staff:", error);
        res.status(500).json({ error: 'Failed to retrieve staff information' });
      }
};



export const getAllStaffWithAssociations = async (req: Request, res: Response) => {
  try {
    // Fetch all staff members
    const staffList = await Staff.findAll();

    res.status(200).json(staffList);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: 'Failed to retrieve staff information' });
  }
};



export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    // Fetch all departments
    const departmentsList = await Department.findAll({
      include: [
        {
          model: Staff,
          as: 'head',
          attributes: ['name', 'number'],
        },
      ],
    });

    res.status(200).json(departmentsList);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: 'Failed to retrieve department information' });
  }
};


export const getDepartmentHistory = async (req: Request, res: Response) => {
    try {
        const { departmentId } = req.params;
    
        if (!departmentId) {
            return res.status(400).json({ error: 'Department ID is required' });
        }
    
        // Fetch department histories for a specific department
        const departmentHistories = await DepartmentHeadHistory.findAll({
            where: {
                departmentId
            },
            include: [
            {
                model: Staff,
                as: 'head',
                attributes: ['name', 'number'],
            },
            ],
            order: [
            ['updatedAt', 'DESC'], // Order by updatedAt in descending order to get the history
            ],
        });
  
      res.status(200).json(departmentHistories);
    } catch (error) {
      console.error("Error fetching department history:", error);
      res.status(500).json({ error: 'Failed to retrieve department history' });
    }
  };
  