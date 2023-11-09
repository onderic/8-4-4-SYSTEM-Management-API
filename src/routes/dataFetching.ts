import express from 'express';
import * as dataFetching from '../controllers/dataFetching'; 

const router = express.Router();

router.get('/classinfo', dataFetching.classesInfomation);

router.get('/allStaff', dataFetching.getAllStaffWithAssociations);

router.get('/getAllDptm', dataFetching.getAllDepartments);

router.get('/getAllDptmHs/:departmentId', dataFetching.getDepartmentHistory);



export default router;
