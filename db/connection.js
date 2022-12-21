if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const uri = process.env.MDB_CONN;

module.exports = {
    connect:  (callback) => {
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
            if (err || !db) {
                return callback(err);
            }
            return callback();
        });
    }
};
