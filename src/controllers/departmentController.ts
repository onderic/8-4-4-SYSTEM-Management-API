import { Request, Response } from "express";
import { Staff } from "../models/staff";
import { Department } from "../models/department";
import { DepartmentHeadHistory } from "../models/departmentHistory"


export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, headId } = req.body;

    const existingDepartmentWithHead = await Department.findOne({
      where: {
        headId,
      },
    });

    if (existingDepartmentWithHead) {
      return res.status(400).json({
        error: "The staff is already leading another department.",
      });
    }

    const head = await Staff.findByPk(headId);

    if (!head) {
      return res.status(400).json({ error: "The department head does not exist." });
    }

    if (head.dataValues.type !== 'TEACHING') {
      return res.status(400).json({
        error: "Invalid department head. Must be a TEACHING staff member.",
      });
    }

    const department = await Department.create({
      name,
      headId,
    } as Department);

    await DepartmentHeadHistory.create({
      departmentId: department.id,
      headId,
      startDate: new Date(),
      endDate: null,
      active: true,
    } as DepartmentHeadHistory);

    res.status(201).json({ message: "Department created successfully", department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create a department. Try again later." });
  }
};


export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await Department.findAll({
      include: [
        {
          model: Staff,
          as: 'head',
        },
      ],
    });

    res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve departments' });
  }
};


export const updateDepartments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, headId } = req.body;

    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({ error: "Department not found." });
    }

    const existingDepartment = await Department.findOne({ where: { headId } });

    if (existingDepartment && existingDepartment.id !== department.id) {
      return res.status(400).json({ error: "The department head is already heading another department." });
    }

    const newHead = await Staff.findByPk(headId);

    if (!newHead) {
      return res.status(400).json({ error: "The new department head does not exist." });
    }

    if (newHead.dataValues.type !== 'TEACHING') {
      return res.status(400).json({ error: "Invalid new department head. Must be a TEACHING staff member." });
    }

    const previousHeadEntry = await DepartmentHeadHistory.findOne({
      where: {
        departmentId: id,
        endDate: null,
      },
    });

    if (previousHeadEntry && previousHeadEntry.headId === headId) {
      return res.status(200).json({ message: "This is the current head of department." });
    }

    if (previousHeadEntry) {
      await previousHeadEntry.update({ endDate: new Date(), active: false });
    }

    await DepartmentHeadHistory.create({
      departmentId: id,
      headId,
      startDate: new Date(),
      endDate: null,
    } as unknown as DepartmentHeadHistory);

    await department.update({ name, headId });

    res.status(200).json({ message: "Department updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update department. Try again later." });
  }
};



export const deleteDepartmentHead = async (req:Request, res:Response)=>{
    try{
        const { id } = req.params

        const existingdepartment = await Department.findByPk(id)

        if (!existingdepartment){
            res.status(404).json({ message: 'Staff not found' });
            return;
        }
        
        await existingdepartment.destroy();
        res.json({ message: 'Department deleted successfully' });

    } catch (error) {
      console.error('Error deleting Department:', error);
      res.status(500).json({ message: 'Error deleting Department' });
    }
}