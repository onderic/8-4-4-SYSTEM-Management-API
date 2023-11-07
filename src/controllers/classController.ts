import { Request, Response } from "express";
import { Class } from "../models/class";
import { Staff } from "../models/staff";

export const createClass = async (req: Request, res: Response) => {
  try {
    const { name, abbreviation, headId } = req.body;

    // Check if the headId is provided
    if (headId) {
      // Check if the headId corresponds to an existing staff member
      const head = await Staff.findByPk(headId);

      if (!head) {
        return res.status(400).json({ error: "Invalid headId. Staff member not found." });
      }

      // Check if the staff member is of type "TEACHING"
      if (head.dataValues.type !== 'TEACHING') {
        return res.status(400).json({ error: "The staff member must be of type TEACHING." });
      }
    }

    // Create a new class and associate it with the specified head staff member (if provided)
    const newClass = await Class.create({
      name,
      abbreviation,
      headId: headId,
    } as Class);

    res.status(201).json({ message: "Class created successfully", newClass });
  } catch (error) {
    const castedError = error as any;
    if (castedError.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'The teacher is alredy  a class Teacher' });
    } else {
        console.error(castedError);
        res.status(500).json({ error: 'Failed to create classRoom Try again' });
    }
}
};

export const getClasses = async (req: Request, res: Response) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: Staff,
          as: 'head', 
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

    // Check if the headId is provided and valid, similar to the createClass logic

    if (headId) {
      const head = await Staff.findByPk(headId);

      if (!head) {
        return res.status(400).json({ error: 'Invalid headId. Staff member not found.' });
      }

      if (head.dataValues.type !== 'TEACHING') {
        return res.status(400).json({ error: 'The staff member must be of type TEACHING.' });
      }
    }

    // Update the class attributes
    classToUpdate.name = name;
    classToUpdate.abbreviation = abbreviation;
    classToUpdate.headId = headId;
    await classToUpdate.save();

    res.status(200).json({ message: 'Class updated successfully', updatedClass: classToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update class' });
  }
}

export const deleteClass = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const classToDelete = await Class.findByPk(id);

    if (!classToDelete) {
      return res.status(404).json({ error: 'Class not found' });
    }

    await classToDelete.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
}


