const User = require('../model/user')
const { StatusCodes } = require('http-status-codes')
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utlis')
const CustomError = require('../errors')

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password')
  res.status(StatusCodes.OK).json({ users })
}
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password')
  if (!user) {
    throw new CustomError.NotFoundError(`user not with id:${req.params.id}`)
  }
  checkPermissions(req.user, user._id)
  res.status(StatusCodes.OK).json({ user })
}
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}
//update user with user.save()
const upDateUser = async (req, res) => {
  const { email, name } = req.body
  if (!email || !name) {
    throw new CustomError.BadRequestError('please provide all values')
  }
  const user = await User.findOne({ _id: req.user.userId })

  user.email = email
  user.name = name
  await user.save()

  const tokenuser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenuser })
  res.status(StatusCodes.OK).json({ user: tokenuser })
}
const upDateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('please provide both values')
  }
  const user = await User.findOne({ _id: req.user.userId })

  const isPasswordCorrect = await user.comparePassword(oldPassword)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthorizedError('Invalid Credentials')
  }
  user.password = newPassword
  await user.save()
  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated' })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  upDateUser,
  upDateUserPassword,
}

//update User with findOneAndUpdate
// const upDateUser = async (req, res) => {
//   const { email, name } = req.body
//   if (!email || !name) {
//     throw new CustomError.BadRequestError('please provide all values')
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   )
//   const tokenuser = createTokenUser(user)
//   attachCookiesToResponse({ res, user: tokenuser })
//   res.status(StatusCodes.OK).json({ user: tokenuser })
// }
