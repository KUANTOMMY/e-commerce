const Product = require('../model/products')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const path = require('path')
const { log } = require('console')

const createProduct = async (req, res) => {
  req.body.user = req.user.userId
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}
const getAllProducts = async (req, res) => {
  const products = await Product.find({})
  res.status(StatusCodes.OK).json({ products, count: products.length })
}
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOne({ id: productId }).populate('reviews')
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id:${productId}`)
  }
  res.status(StatusCodes.OK).json({ product })
}
const updateProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOneAndUpdate({ id: productId }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!product) {
    throw new CustomError.NotFoundError('`No product with id:${productId}`')
  }
  res.status(StatusCodes.OK).json({ product })
}
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOne({ id: productId })
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id:${productId}`)
  }
  await product.remove()
  res.status(StatusCodes.OK).json({ msg: 'sucess! product remove' })
}
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('Not file upload')
  }
  const productImage = req.files.image
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('please upload ')
  }
  const maxsize = 1024 * 1024
  if (productImage.size > maxsize) {
    throw new CustomError.BadRequestError('please upload image small than 1MB ')
  }
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  )
  await productImage.mv(imagePath)
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` })
}

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
}
