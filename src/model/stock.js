import mongoose from '../service/db';

var Schema = mongoose.Schema;
const STOCK_MODEL = 'STOCK';
const connection = mongoose.connection;

export const TYPE = {
    MY:1,
    INTL: 2,
    TODAY: 3
};

let StockSchema = new Schema({
    created_date: { type: Date, default: Date.now },
    name: String,
    value: Number,
    change: Number,
    changeRate: Number,
    volume: Number,
    marketCap: Number,
    per: Number,
    evaluated: Number,
    evaluatedRate: Number,
    type: String
});

StockSchema.statics.findByType = function (type, cb) {
    this.find({ type: type})
        .exec((err, docs) => {
            cb(err, docs.map(val => val.toObject()));
        });
};

export const Stock = connection.model(STOCK_MODEL, StockSchema);


// StockSchema.pre('save', function (next) {
//     Stock.find({stockId: this.stockId}).exec((err, docs) => {
//         if (!docs.length) {
//             return next();
//         }
//     });
// });


