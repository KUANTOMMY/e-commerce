const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    require: [true, 'please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'please provide valid email',
    },
  },
  password: {
    type: String,
    require: [true, 'please provide password'],
    minlength: 6,
  },
  role: {
    type: String,
    eum: ['admin', 'user'],
    default: 'user',
  },
})

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)

  return isMatch
}

module.exports = mongoose.model('user', UserSchema)
// console.log(this.modifiedPaths()) 這個方法會回傳一個 陣列，其中包含了被修改的欄位名稱。
// console.log(this.ismodified('name')) 這個方法會回傳一個 布林值（Boolean），用來判斷某個欄位是否有被修改。
