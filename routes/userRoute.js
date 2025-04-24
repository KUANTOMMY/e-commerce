const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  upDateUser,
  upDateUserPassword,
} = require('../controller/userCountroller')

router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin', 'user'), getAllUsers)
router.route('/updateUser').patch(authenticateUser, upDateUser)
router.route('/updateUserPassword').patch(authenticateUser, upDateUserPassword)

router.route('/showme').get(authenticateUser, showCurrentUser)
router.route('/:id').get(authenticateUser, getSingleUser)

module.exports = router
