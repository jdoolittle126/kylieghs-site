require('../models/config.model');

const mongoose = require('mongoose');
const Config = mongoose.model('Config');

module.exports.ConfigController = {
    getConfig: async () => {
        return await Config.findOne().lean().exec();
    },
}

