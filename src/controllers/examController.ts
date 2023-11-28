import { Request, Response } from 'express';
import { Exam } from '../models/exam';
import { Class } from '../models/class';
import { Subject } from '../models/subject';
import { SubjectsToBeDone } from '../models/subjectsToBeDone';
import { UniqueConstraintError } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';


export const createExam = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, name, classSubjects } = req.body;
    if (!startDate || !endDate || !name || !classSubjects) {
      return res.status(400).json({ error: 'All fields are required!' });
    }

    const existingExamName = await Exam.findOne({
      where: {
        name,
      },
    });

    if (existingExamName) {
      return res.status(400).json({ error: 'The exam name already exists!' });
    }

    const exam = await Exam.create({
      startDate,
      endDate,
      name,
    });

    //Process each class and its subjects
    for (const classSubject of classSubjects) {
      const { classID, subjects } = classSubject;

      for (const allocatedSubject of subjects) {
        const { subjectId, maxScore } = allocatedSubject;

        try {
          // Check if a record already exists
          const existingRecord = await SubjectsToBeDone.findOne({
            where: {
              examId: exam.id,
              subjectId,
              classId: classID || null,
            },
          });

          if (!existingRecord) {
            await SubjectsToBeDone.create({
              examId: exam.id,
              subjectId,
              maxScore,
              classId: classID,
            });

            // console.log(`Created record for examId: ${exam.id}, subjectId: ${subjectId}, classId: ${classID}`);
          } else {
            // console.log(`Record already exists for examId: ${exam.id}, subjectId: ${subjectId}, classId: ${classID}`);
          }
        } catch (error) {
          if (error instanceof UniqueConstraintError) {
            console.log(`Record already exists for examId: ${exam.id}, subjectId: ${subjectId}, classId: ${classID}`);
          } else {
            throw error;
          }
        }
      }
    }

    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getAllExam = async (req: Request, res: Response) => {
  try {
    const allExams = await Exam.findAll({
      attributes: ['id', 'name', 'startDate', 'endDate'],
    });

    if (allExams.length === 0) {
      return res.status(404).json({ error: 'Exams not found' });
    }

    const examsWithDetails = await Promise.all(
      allExams.map(async (exam) => {
        const classesWithSubjects = await Class.findAll({
          include: [
            {
              model: SubjectsToBeDone,
              where: { examId: exam.id },
              attributes: ['maxScore'],
              include: [
                {
                  model: Subject,
                  attributes: ['name', 'code', 'isCompulsory'],
                },
              ],
            },
          ],
          attributes: ['id', 'name', 'abbreviation'],
        });

        return {
          ...exam.toJSON(),
          classes: classesWithSubjects,
        };
      })
    );

    res.status(200).json(examsWithDetails);
  } catch (error) {
    console.error('Error fetching all exams:', error);
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

    if (classId) {
      const selectedClass = await Class.findByPk(classId);

      if (!selectedClass) {
        return res.status(400).json({ error: 'Invalid class id' });
      }
    }

    // Update exam details
    await exam.update({ name, startDate, endDate });

    if (subjectsToBeDone) {
      for (const subjectDetail of subjectsToBeDone) {
        const { subjectId, maxScore } = subjectDetail;

        // Check if the subject exists
        const subject = await Subject.findByPk(subjectId);

        if (!subject) {
          return res.status(400).json({ error: `Subject with id ${subjectId} not found` });
        }

        try {
          const existingRecord = await SubjectsToBeDone.findOne({
            where: {
              examId: exam.id,
              subjectId,
              classId: classId || null,
            },
          });

          if (!existingRecord) {
            await SubjectsToBeDone.create({
              examId: exam.id,
              subjectId,
              maxScore,
              classId: classId || null,
            });
          } else {
            await existingRecord.update({ maxScore });
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
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

export const getEachExam = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const examData = await Exam.findByPk(id, {
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
                  attributes: ['name', 'code', 'isCompulsory'],
                },
              ],
              where: { examId: id },
            },
          ],
          through: { attributes: [] },
        },
      ],
      attributes: ['id', 'name', 'startDate', 'endDate'],
    });

    if (!examData) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.status(200).json(examData);
  } catch (error) {
    console.error('Error fetching exam by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
