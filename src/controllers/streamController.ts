import { Request, Response } from "express";
import { Stream } from "../models/stream";
import { Class } from "../models/class";
import { Staff } from "../models/staff";

export const createStream = async (req: Request, res: Response) => {
  try {
    const { name, abbreviation, teacher, classId } = req.body;

    // Check if the teacher and classId exist
    const [checkDetails, foundClass] = await Promise.all([
      Staff.findByPk(teacher),
      Class.findByPk(classId),
    ]);

    if (!checkDetails || !foundClass) {
      return res.status(400).json({ error: "Invalid teacher or classId." });
    }

    // Create a new stream
    const newStream = await Stream.create({
      name,
      abbreviation,
      teacher,
      classId,
    } as Stream );

    res.status(201).json({ message: "Stream created successfully", newStream });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create a stream' });
  }
}
