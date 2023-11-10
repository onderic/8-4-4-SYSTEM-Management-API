import { Request, Response } from "express";
import { Stream } from "../models/stream";
import { Class } from "../models/class";
import { Staff } from "../models/staff";


export const createStream = async (req: Request, res: Response) => {
  try {
    const { name, abbreviation, teacher, classId } = req.body;

    const existingTeacher = await Staff.findByPk(teacher);
    const existingClass = await Class.findByPk(classId);

    if (!existingTeacher || !existingClass) {
      return res.status(400).json({ error: "Invalid teacher or classId." });
    }

    const existingStreamByName = await Stream.findOne({ where: { name } });
    if (existingStreamByName) {
      return res.status(400).json({ error: "A stream with the same name already exists." });
    }

    const existingAbbreviation = await Stream.findOne({ where: { abbreviation } });
    if (existingAbbreviation) {
      return res.status(400).json({ error: "Abbreviation already exists." });
    }

    const newStream = await Stream.create({
      name,
      abbreviation,
      teacher,
      classId,
    } as Stream);

    res.status(201).json({ message: "Stream created successfully", newStream });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create a stream' });
  }
};

export const getStreams = async (req: Request, res: Response) => {
    try {
      const streams = await Stream.findAll({
        include: [
          {
            model: Staff,
            as: 'staff', 
            attributes: ['name', 'number'],
          },
          {
            model: Class,
            as: 'class',
            attributes: ['name', 'abbreviation'],
          },
        ],
      });
  
      res.status(200).json(streams);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve streams' });
    }
}


export const updateStream = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, abbreviation, teacher, classId } = req.body;

    const existingStream = await Stream.findByPk(id);

    if (!existingStream) {
      res.status(404).json({ message: 'Stream not found' });
      return;
    }

    const updatedStream = await existingStream.update({
      name, abbreviation, teacher, classId
    });

    res.json({ message: 'Stream updated successfully',updatedStream });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the stream' });
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
  