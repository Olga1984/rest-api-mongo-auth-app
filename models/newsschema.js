const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
    news: {
        news: {type: String,
        required:[true, 'news is required']},
        title: String
    }
});
const NewsModel = mongoose.model('News', NewsSchema);
module.exports = NewsModel;
