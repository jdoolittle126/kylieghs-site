const mongoose = require('mongoose');

const affirmationSchema = new mongoose.Schema({
    index: Number,
    message: String
}, {
    strictQuery: false
});

let Affirmation = mongoose.model('Affirmation', affirmationSchema);

module.exports = Affirmation
