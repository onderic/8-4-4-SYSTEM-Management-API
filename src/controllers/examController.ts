import { Request, Response } from 'express';
import { Exam } from '../models/exam';
import { Class } from '../models/class';
import { Subject } from '../models/subject';
import { ExamSubject } from '../models/examSubjectPivot';
import { Staff } from '../models/staff';



export const createExam = async (req: Request, res: Response) => {
    try {
      const { name, startDate, endDate, classId, subjectDetails } = req.body;
  
      if (!name || !startDate || !endDate || !classId || !subjectDetails || subjectDetails.length === 0) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Check if the class exists
      const classExists = await Class.findByPk(classId);
  
      if (!classExists) {
        return res.status(400).json({ error: 'Invalid class id' });
      }
  
      try {
        // Create an exam with the specified attributes
        const exam = await Exam.create({ name, startDate, endDate, classId });
  
        // Loop through each subject and create ExamSubject entries
        for (const subjectDetail of subjectDetails) {
          const { subjectId, maxScore } = subjectDetail;
  
          // Check if the subject exists
          const subject = await Subject.findByPk(subjectId);
  
          if (!subject) {
            return res.status(400).json({ error: `Subject with id ${subjectId} not found` });
          }
  
          // Create ExamSubject entry
          await ExamSubject.create({ examId: exam.id, subjectId, maxScore });
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
            model: ExamSubject,
            attributes: ['id', 'maxScore'],
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
  