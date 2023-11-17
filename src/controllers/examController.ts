import { Request, Response } from 'express';
import { Exam } from '../models/exam';
import { Class } from '../models/class';
import { Subject } from '../models/subject';
import { SubjectsToBeDone } from '../models/subjectsToBeDone';
import { Staff } from '../models/staff';


export const createExam = async (req: Request, res: Response) => {
  try {
    const { name, startDate, endDate, classIds, subjectsToBeDone } = req.body;

    if (!name || !startDate || !endDate || !classIds || !subjectsToBeDone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Check if exams with the same name and subjects already exist for any of the specified classes
      const existingExams = await Exam.findAll({
        where: {
          name,
          classId: classIds,
        },
      });

      if (existingExams.length > 0) {
        return res.status(400).json({ error: 'Exam with the same name and subjects already exists for one or more classes' });
      }

      const createdExams = [];

      // Loop through each classId and create exams
      for (const classId of classIds) {
        // Check if the specified class exists
        const selectedClass = await Class.findByPk(classId);

        if (!selectedClass) {
          return res.status(400).json({ error: `Invalid class id: ${classId}` });
        }

        const exam = await Exam.create({ name, startDate, endDate, classId });

        // Loop through each subject and create ExamSubject entries
        for (const subjectDetail of subjectsToBeDone) {
          const { subjectId, maxScore } = subjectDetail;

          const subject = await Subject.findByPk(subjectId);

          if (!subject) {
            return res.status(400).json({ error: `Subject with id ${subjectId} not found` });
          }

          // Create subjectsToBeDone entry
          await SubjectsToBeDone.create({
            examId: exam.id,
            classId,
            subjectId,
            maxScore,
          });
        }
        createdExams.push(exam);
      }
      return res.status(201).json({ message: 'Exams created successfully', exams: createdExams });
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
            model: SubjectsToBeDone,
            attributes: ['maxScore'],
            include: [
              {
                model: Subject,
                attributes: ['name', 'code', 'isCompulsory'],
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
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
    
          await SubjectsToBeDone.update(
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