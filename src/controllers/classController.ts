import { Request, Response } from "express";
import { Class } from "../models/class";
import { Staff } from "../models/staff";
import { UniqueConstraintError } from 'sequelize';



export const createClass = async (req: Request, res: Response) => {
  try {
    const { name, abbreviation, headId } = req.body;

    if (!name || !abbreviation || !headId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Check if a class with the same name already exists
      await Class.create({ name, abbreviation, headId }); 

      // Check if the staff member with headId exists and is of type TEACHING
      const head = await Staff.findByPk(headId);
      if (!head) {
        return res.status(400).json({ error: "Invalid headId. Staff member not found." });
      }
      if (head.dataValues.type !== 'TEACHING') {
        return res.status(400).json({ error: "The staff member must be of type TEACHING." });
      }

      const existingClassByHeadId = await Class.findOne({ where: { headId } });
      if (existingClassByHeadId) {
        return res.status(400).json({ error: "The staff member is already assigned to another class." });
      }

      // If all checks pass, create the new class
      const newClass = await Class.create({
        name,
        abbreviation,
        headId,
      });

      res.status(201).json({ message: "Class created successfully", newClass });
    } catch (error) {
      // Handle UniqueConstraintError
      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ error: "A class with the same name or abbreviation already exists." });
      }

      console.error(error);
      res.status(500).json({ error: 'Failed to create class. Try again.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create class. Try again.' });
  }
};



export const getClasses = async (req: Request, res: Response) => {
  try {
    const classes = await Class.findAll({
      attributes: ['id', 'name','abbreviation'],
      include: [
        {
          model: Staff,
          as: 'head', 
          attributes: ['id','name', 'number'],
        },
      ],
    });

    res.status(200).json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve classes' });
  }
}


export const updateClass = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, abbreviation, headId } = req.body;

  try {
    const classToUpdate = await Class.findByPk(id);

    if (!classToUpdate) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (headId) {
      const head = await Staff.findByPk(headId);

      if (!head) {
        return res.status(400).json({ error: 'Invalid headId. Staff member not found.' });
      }

      if (head.dataValues.type !== 'TEACHING') {
        return res.status(400).json({ error: 'The staff member must be of type TEACHING.' });
      }
      const existingClass = await Class.findOne({ where: { headId } });

      if (existingClass && existingClass.dataValues.headId === headId) {
        return res.status(200).json({ message: "This is the current head of Class." });
      }
      if (existingClass) {
        return res.status(400).json({ error: "The staff member is already assigned to another class." });
      }
    }

    const updatedClass = await classToUpdate.update({
      name,
      abbreviation,
      headId
    });

    res.status(200).json({ message: 'Class updated successfully', updatedClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const classToDelete = await Class.findByPk(id);

    if (!classToDelete) {
      return res.status(404).json({ error: 'Class not found' });
    }

    await classToDelete.destroy();
    res.status(200).json({ message: 'Class Deleted successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


