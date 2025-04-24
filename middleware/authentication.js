const customError = require('../errors')
const { jwtTokenValid } = require('../utlis')

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.tokenName
  if (!token) {
    throw new customError.UnauthenticatedError('Authentication Invalid')
  }

  try {
    const { name, userId, role } = jwtTokenValid({ token })
    req.user = { name, userId, role }
    next()
  } catch (error) {
    throw new customError.UnauthenticatedError('Authentication Invalid')
  }
}

const authorizePermissions = (...roles) => {
  // if (req.user.role !== 'admin') {
  //   throw new customError.UnauthorizedError('Unauthorized to access this route')
  // }
  // next()
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new customError.UnauthorizedError(
        'Unauthorized to access this route'
      )
    }
    next()
  }
}
module.exports = { authenticateUser, authorizePermissions }
