require('../models/affirmation.model');

const mongoose = require('mongoose');
const Affirmation = mongoose.model('Affirmation');


module.exports.AffirmationController = {
    findAffirmationByObjectId: async (id) => {
        return await Affirmation.findById(id).lean().exec();
    },
    getAllAffirmations: async (config) => {
        return await Affirmation.find({
            index: {$lt: config.daysSince + 1}
        }).sort({index: 1}).lean().exec();
    },
}

