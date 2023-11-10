import { Request, Router, Response } from 'express'
import { userStatus } from '../common'
import { userRouter } from './user'
import { adminRouter } from './admin'
import { teacherRouter } from './teacher'
import { sub_adminRouter } from './sub_admin'
import { schoolRouter } from './school'
import { uploadValidation } from '../validation'
import { compress_image, image_compress_response, multer_image_compress_response, multer_image_non_compress_response, uploadS3, compress_image_Without } from '../helpers/S3'
import { partial_userJWT, userJWT } from '../helpers/jwt'
import { studentRouter } from './student'
import { auditorRouter } from './auditor'
import { facultyRouter } from './faculty'
import multer from 'multer'

const upload = multer({ dest: 'multer_uploads/' })
const router = Router()
const accessControl = (req: Request, res: Response, next: any) => {
    req.headers.userType = userStatus[req.originalUrl.split('/')[1]]
    next()
}

router.use('/user', accessControl, userRouter)
router.use('/admin', accessControl, adminRouter)
router.use('/teacher', accessControl, teacherRouter)
router.use('/faculty', accessControl, facultyRouter)
router.use('/sub_admin', accessControl, sub_adminRouter)
router.use('/school', accessControl, schoolRouter)
router.use('/student', accessControl, studentRouter)
router.use('/auditor', accessControl, auditorRouter)
// router.post('/upload/:file', accessControl, userJWT, uploadValidation.file_type, compress_image.single('image'), image_compress_response)
// router.post('/uploads/:file', accessControl, uploadValidation.file_type, compress_image_Without.single('image'), image_compress_response)
// router.post('/upload/file_upload/:file', accessControl, userJWT, uploadValidation.file_type, uploadS3.single('file'), image_compress_response)
router.post('/upload/:file', accessControl, partial_userJWT, uploadValidation.file_type, upload.single('image'), multer_image_compress_response)
router.post('/upload/file_upload/:file', accessControl, userJWT, uploadValidation.file_type, upload.single('file'), multer_image_non_compress_response)

export { router }