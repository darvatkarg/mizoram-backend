import { Router } from 'express'
import { authenticationController, studentController } from '../controllers'
import { userJWT } from '../helpers/jwt'
import { userValidation } from '../validation'
const router = Router()

router.post('/signUp', userValidation.signUp, authenticationController.signUp)
router.get('/deleteUser', studentController.temp_delete_user)
router.get('/sms_testing', studentController.temp_testing_sms_v1)

//  ------   Authentication ------  
router.use(userJWT)

//sub Admin
router.post('/add')

export const userRouter = router
