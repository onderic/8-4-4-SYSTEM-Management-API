import { Request, Response } from "express";
import { Staff } from "../models/staff";
import { Department } from "../models/department";
import { DepartmentHeadHistory } from "../models/departmentHistory"


export const createDepartment = async (req:Request, res:Response) =>{
    try{
        const { name, headId, startDate } = req.body

        const head = await Staff.findByPk(headId);

        if (!head || head.dataValues.type !== 'TEACHING') {
            return res.status(400).json({ error: "Invalid department head.Or Must be a TEACHING staff member." });
        }

        // create department
        const department = await Department.create({
            name,
            headId
        } as Department);

        // Create an entry in DepartmentHeadHistory
        await DepartmentHeadHistory.create({
            departmentId: department.id,
            headId: headId,
            startDate,
            endDate: null
        }as DepartmentHeadHistory);
        // console.log("New dep history", DepartmentHeadHistory)
        res.status(201).json({ message: "Department created successfully", department });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Failed to create a department try again later" });
    }

   
}

