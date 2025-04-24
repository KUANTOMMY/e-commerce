import { ObjectId } from 'mongodb'
;[
  {
    $match: {
      product: new ObjectId('67e3b27c0d1862611639886b'),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: '$rating',
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
]
