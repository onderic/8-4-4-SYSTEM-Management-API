import { Request, Response } from 'express';
import { Exam } from '../models/exam';
import { Class } from '../models/class';
import { Subject } from '../models/subject';
import { SubjectsUnderTheExam } from '../models/subjectsUnderTheExam';
import { Staff } from '../models/staff';


export const createExam = async (req: Request, res: Response) => {
  try {
    const { name, startDate, endDate, classId, subjectsToBeDone } = req.body;

    if (!name || !startDate || !endDate || !classId || !subjectsToBeDone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the specified class exists
    const selectedExam = await Class.findByPk(classId);

    if (!selectedExam) {
      return res.status(400).json({ error: 'Invalid class id' });
    }

    try {
      // Check if an exam with the same name, class, and subjects already exists
      const existingExam = await Exam.findOne({
        where: {
          name,
          classId,
        },
      });

      if (existingExam) {
        return res.status(400).json({ error: 'Exam with the same name, class, and subjects already exists' });
      }

      // Create the exam
      const exam = await Exam.create({ name, startDate, endDate, classId });

      // Loop through each subject and create ExamSubject entries
      for (const subjectDetail of subjectsToBeDone) {
        const { subjectId, maxScore } = subjectDetail;

        // Check if the subject exists
        const subject = await Subject.findByPk(subjectId);

        if (!subject) {
          return res.status(400).json({ error: `Subject with id ${subjectId} not found` });
        }

        // Create SubjectsUnderTheExam entry
        await SubjectsUnderTheExam.create({
          examId: exam.id,
          classId,
          subjectId,
          maxScore,
        });
      }

      // Send a success response
      return res.status(201).json({ message: 'Exam created successfully', exam });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const getAllExam = async (req: Request, res: Response) => {
    try {
      // Fetch all exams with associated class and subjects
      const examList = await Exam.findAll({
        attributes: ['id', 'name', 'startDate','endDate'],
        include: [
          {
            model: Class,
            attributes: ['id', 'name', 'abbreviation'],
            include: [
                {
                  model: Staff,
                  attributes: ['id', 'name', 'type'],
                },
              ],
          },
          {
            model: SubjectsUnderTheExam,
            attributes: ['examId', 'maxScore'],
            include: [
              {
                model: Subject,
                attributes: ['id', 'name', 'code', 'isCompulsory'],
              },
            ],
          },
        ],
      });
  
      res.status(200).json(examList);
    } catch (error) {
      console.error("Error fetching exams:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  
export const updateExam = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, startDate, endDate, classId, subjectsToBeDone } = req.body;
  
      const exam = await Exam.findByPk(id);
  
      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      if(classId){
        const selectedClass = await Class.findByPk(classId);

        if (!selectedClass) {
          return res.status(400).json({ error: 'Invalid class id' });
        }
      }
  
      // Update exam details
      await exam.update({ name, startDate, endDate, classId });
  
      // Loop through each subject and update/create ExamSubject entries
      if(subjectsToBeDone){
        for (const subjectDetail of subjectsToBeDone) {
          const { subjectId, maxScore } = subjectDetail;
    
          // Check if the subject exists
          const subject = await Subject.findByPk(subjectId);
    
          if (!subject) {
            return res.status(400).json({ error: `Subject with id ${subjectId} not found` });
          }
    
          await SubjectsUnderTheExam.update(
            { maxScore },
            {
              where: {
                examId: exam.id,
              },
            }
          );
        }
      }
      
      return res.status(200).json({ message: 'Exam updated successfully', exam });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  

export const deleteExam = async (req:Request, res:Response) =>{
  try {
    const { id } = req.params;

    const exam = await Exam.findByPk(id);

    if(!exam){
      return res.status(404).json({ error: 'Exam not found' });
    }

    await exam.destroy();

    res.status(200).json({ message: 'Subject deleted successfully' });
  }catch (error){
    console.log(error)
    res.status(500).json({error:'internal server error'})
  }
}