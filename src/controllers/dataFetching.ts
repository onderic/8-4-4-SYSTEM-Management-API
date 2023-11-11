import { Request, Response } from "express";
import { Staff } from "../models/staff";
import { Class } from "../models/class";
import { Stream } from "../models/stream";
import { Department } from "../models/department";  
import { DepartmentHeadHistory } from "../models/departmentHistory"; 


export const getAllStaffMembers = async (req: Request, res: Response) => {
  try {
    // Fetch all staff members
    const staffList = await Staff.findAll({
      attributes: ['id','name', 'number','type'],
      include: [
        {
        model: Class,
        attributes: ['name', 'abbreviation'],
      },
      {
        model:Stream,
        attributes: ['name', 'abbreviation'],
        include: [
          {
            model: Class,
            attributes: ['name', 'abbreviation'],
          },
        ],
      },
      {
        model:Department,
        attributes: ['name'],
      }
    ],
    });

    res.status(200).json(staffList);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const classesInfomation = async (req: Request, res: Response) => {
    try {
        const staffList = await Class.findAll({
          attributes: ['name', 'abbreviation'],
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
                  as: 'teacher',
                  attributes: ['name', 'number'],
                },
              ],
            },
          ],
        });
    
        res.status(200).json(staffList);
      } catch (error) {
        console.error("Error fetching staff:", error);
        res.status(500).json({ error: 'Internal server error' });
      }
};

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    // Fetch all departments
    const departmentsList = await Department.findAll({
      attributes: ['id','name'],
      include: [
        {
          model: Staff,
          as: 'head',
          attributes: ['name', 'number'],
        },
        {
          model: DepartmentHeadHistory,
          as: 'headHistory',
          attributes: ['startDate', 'endDate','active'],
          // where: { active: true },
          include: [
            {
              model: Staff,
              as: 'head',
              attributes: ['name', 'number'],
            },
          ],
          order: [
            ['updatedAt', 'DESC'], 
            ],
        },
      ],
    });

    res.status(200).json(departmentsList);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllDepartmentHistory = async (req: Request, res: Response) => {
    try {
        const departmentHistories = await DepartmentHeadHistory.findAll({
          attributes: ['id','startDate', 'endDate', 'active'],
            include: [
              {
                model: Department,
                as: 'department',
                attributes: ['name'],
              },
              {
                  model: Staff,
                  as: 'head',
                  attributes: ['name', 'number'],
              },
              ],
              order: [
              ['updatedAt', 'DESC'], 
              ],
        });
  
      res.status(200).json(departmentHistories);
    } catch (error) {
      console.error("Error fetching department history:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  