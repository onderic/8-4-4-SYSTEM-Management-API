import express from 'express';
import * as dataFetching from '../controllers/dataFetching'; 

const router = express.Router();


router.get('/allStaff', dataFetching.getAllStaffMembers);

router.get('/classinfo', dataFetching.classesInfomation);

router.get('/getAllDptm', dataFetching.getAllDepartments);

router.get('/getAllDptmtHistory', dataFetching.getAllDepartmentHistory);



export default router;
