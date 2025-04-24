const User = require('../model/user')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utlis')

const register = async (req, res) => {
  const { email, name, password } = req.body
  const emailAlredyExists = await User.findOne({ email })
  if (emailAlredyExists) {
    throw new CustomError.BadRequestError('Email alredy exists')
  }

  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  const user = await User.create({ name, email, password, role })
  const jwtpayload = createTokenUser(user)
  attachCookiesToResponse({ res, user: jwtpayload })
  res.status(StatusCodes.CREATED).json({ user: user })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new CustomError.BadRequestError('please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new CustomError.UnauthenticatedError('invalid Credential')
  }
  const isPasswordCorrent = await user.comparePassword(password)
  if (!isPasswordCorrent) {
    throw new CustomError.UnauthenticatedError('invalid Credential')
  }

  const jwtpayload = createTokenUser(user)
  attachCookiesToResponse({ res, user: jwtpayload })
  res.status(StatusCodes.CREATED).json({ user: user })
  res.send('login user')
}

const logout = async (req, res) => {
  res.cookie('tokeNname', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logout' })
}

module.exports = { register, login, logout }
