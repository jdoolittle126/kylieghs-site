const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    startDate: Date,
    endDate: Date
}, {
    strictQuery: false
});

let Config = mongoose.model('Config', configSchema);

module.exports = Config
