const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
  return token
}

const jwtTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user })
  const oneDay = 1000 * 60 * 60 * 24

  res.cookie('tokenName', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'productuin',
    signed: true,
  })
}

module.exports = { createJWT, jwtTokenValid, attachCookiesToResponse }
