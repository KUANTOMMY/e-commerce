const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'please provide product name'],

      maxlength: [50, 'name can not be more than characters '],
    },
    price: {
      type: Number,
      default: 0,
      required: [true, 'please provide product price'],
    },
    description: {
      type: String,
      required: [true, 'please provide product description'],
      maxlength: [1000, 'description cannot be more than 1000 characters'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpg',
    },
    category: {
      type: String,
      required: [true, 'please provide product category'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      reqired: [true, 'please provide company'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported',
      },
    },
    colors: {
      type: [String],
      default: ['#222'],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      defult: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

ProductSchema.virtual('reviews', {
  ref: 'review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
})

ProductSchema.pre('remove', async function (next) {
  await this.model('review').deleteMany({ product: this._id })
})

module.exports = mongoose.model('Product', ProductSchema)
