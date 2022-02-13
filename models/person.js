const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                const parts = v.split('-')
                if (parts.length > 2) {
                    return false
                } else if (parts[0].length > 3 || parts[0].length < 2) {
                    return false
                } else if (parts[1].length < 5) {
                    return false
                }
                return true
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        minlength: 8
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)