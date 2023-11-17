import { Request, Response } from 'express';
import { Exam } from '../models/exam';
import { Class } from '../models/class';
import { Subject } from '../models/subject';
import { SubjectsToBeDone } from '../models/subjectsToBeDone';
import { Staff } from '../models/staff';



export const createExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, name, classes } = req.body;

    if (!startDate || !endDate || !name || !Array.isArray(classes)) {
      res.status(400).json({ message: 'Invalid request. Provide startDate, endDate, name, and an array of classes.' });
      return;
    }

    // Create the exam
    const exam = await Exam.create({
      startDate,
      endDate,
      name,
      classId: classes[0].classID,
    });

    // Loop through each class in the request
    for (const classData of classes) {
      const { classID, subjects } = classData;

      // Check if the class exists
      const targetClass = await Class.findByPk(classID, {
        include: [{ model: Subject, attributes: ['id'] }],
      });

      if (!targetClass) {
        res.status(404).json({ message: `Class with ID ${classID} not found.` });
        return;
      }

      // Loop through each subject in the class
      for (const subjectData of subjects) {
        const { subjectId, maxscore } = subjectData;

        // Create SubjectsToBeDone with examId, subjectId, maxScore, and classId
        await SubjectsToBeDone.create({
          examId: exam.id,
          subjectId,
          maxScore: maxscore,
          classId: classID,
        });
      }
    }

    // Fetch the exam with associated class and subjects
    const examWithAssociations = await Exam.findByPk(exam.id, {
      include: [{ model: Class, include: [{ model: Subject }] }],
    });

    res.status(201).json({ message: 'Exam with subjects created successfully', exam: examWithAssociations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create exam with subjects. Try again.' });
  }
};


export const getAllExam = async (req: Request, res: Response) => {
  try {
    // Fetch all exams with associated class and subjects
    const examList = await Exam.findAll({
      include: [
        {
          model: Class,
          attributes: ['id', 'name', 'abbreviation'],
          include: [
            {
              model: SubjectsToBeDone,
              attributes: ['maxScore'],
              include: [
                {
                  model: Subject,
                  attributes: ['name', 'code','isCompulsory'],
                },
              ],
            },
          ],
        },
      ],
      attributes: ['id', 'name', 'startDate', 'endDate'],
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
      await exam.update({ name, startDate, endDate });
  
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