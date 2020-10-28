const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: false
    },
    subSections: [
        {
            question: {
                type: String,
                required: true
            },
            answer: {
                type: String
            },
            screen: {
                type: String
            }
        }
    ],
    // userId: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
}, { timestamps: true });

module.exports = mongoose.model('Section', SectionSchema);