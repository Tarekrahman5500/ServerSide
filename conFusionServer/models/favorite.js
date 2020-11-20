const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Dish'
    }]
}, {
    timestamps: true
});

const Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;