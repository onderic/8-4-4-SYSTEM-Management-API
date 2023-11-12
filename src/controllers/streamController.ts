import { Request, Response } from "express";
import { Stream } from "../models/stream";
import { Class } from "../models/class";
import { Staff } from "../models/staff";


export const createStream = async (req: Request, res: Response) => {
  try {
    const { name, abbreviation, teacherId, classId } = req.body;

    if (!name || !abbreviation || !teacherId || !classId) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const existingTeacher = await Staff.findByPk(teacherId);
    const existingClass = await Class.findByPk(classId);

    if (!existingTeacher || !existingClass) {
      return res.status(400).json({ error: 'Invalid teacherId or classId.' });
    }

    if (existingTeacher.dataValues.type !== 'TEACHING') {
      return res.status(400).json({ error: "The staff member must be of type TEACHING." });
    }
    // Check for the uniqueness of the stream name and abbreviation within the class
    const existingStreamInClass = await Stream.findOne({
      where: {
        name,
        abbreviation,
        classId,
      },
    });

    if (existingStreamInClass) {
      return res.status(400).json({ error: 'A stream with the same name and abbreviation already exists in this class.' });
    }

    const newStream = await Stream.create({
      name,
      abbreviation,
      teacherId,
      classId,
    });

    res.status(201).json({ message: 'Stream created successfully', newStream });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStreams = async (req: Request, res: Response) => {
  try {
    const streams = await Stream.findAll({
      attributes: ['id','name', 'abbreviation'],
      include: [
        {
          model: Staff,
          as: 'teacher',
          attributes: ['name', 'number'],
        },
        {
          model: Class,
          as: 'streamClass',
          attributes: ['name', 'abbreviation'],
        },
      ],
    });

    res.status(200).json(streams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateStream = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, abbreviation, teacherId, classId } = req.body;

    const existingStream = await Stream.findByPk(id);

    if (!existingStream) {
      res.status(404).json({ message: 'Stream not found' });
      return;
    }
    const existingTeacher = await Staff.findByPk(teacherId);

    if (!existingTeacher) {
      return res.status(400).json({ error: 'Invalid teacherId' });
    }
    if (existingTeacher.dataValues.type !== 'TEACHING') {
      return res.status(400).json({ error: "The staff member must be of type TEACHING." });
    }

    const updatedStream = await existingStream.update({
      name, abbreviation, teacherId, classId
    });

    res.json({ message: 'Stream updated successfully',updatedStream });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
  
  
export const deleteStream = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      // Find the stream by its ID
      const existingStream = await Stream.findByPk(id);
  
      if (!existingStream) {
        return res.status(404).json({ error: "Stream not found." });
      }
  
      // Delete the stream
      await existingStream.destroy();
  
      res.status(200).json({ message: "Stream deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete the stream' });
    }
}
  