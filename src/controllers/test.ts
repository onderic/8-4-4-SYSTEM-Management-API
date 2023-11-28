
// let exam = {
//     startDate:'2022-2-13',
//     endDate:'2022-2-18',
//     name:"openinig exam",
//     classes: [
//         {
//             classID:1,
//             subjects: [
//                 {
//                     subjectId: 1,
//                     maxscore: 80
//                 },
//                 {
//                     subjectId: 2,
//                     maxscore: 90
//                 }


//             ]
//         },
//         {
//             classID:2,
//             subjects: [
//                 {
//                     subjectId: 1,
//                     maxscore: 80
//                 },
//                 {
//                     subjectId: 2,
//                     maxscore: 90
//                 }
                

//             ]
//         }

//     ]

// }

// export const getAllExam = async (req: Request, res: Response) => {
//     try {
//       const examsWithSubjects = await Exam.findAll({
    //         include: [
    //           {
    //             model: Class,
    //             attributes: ['id', 'name', 'abbreviation'],
    //             include: [
    //               {
    //                 model: SubjectsToBeDone,
    //                 attributes: ['maxScore'],
    //                 include: [
    //                   {
    //                     model: Subject,
    //                     attributes: ['name', 'code', 'isCompulsory'],
    //                   },
    //                 ],
    //               },
    //             ],
    //             through: { attributes: [] },
    //           },
    //         ],
    //         attributes: ['id', 'name', 'startDate', 'endDate'],
    //         order: [['createdAt', 'DESC']],
//       });
  
//       res.status(200).json(examsWithSubjects);
//     } catch (error) {
//       console.error('Error fetching exams with subjects:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   };