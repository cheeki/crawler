import mongoose from 'mongoose';
import configs from '../../config/db.json';
import {logger} from './logger';

const config = configs;
const uri = config.host + ':' + config.port + '/' + config.database;

mongoose.Promise = global.Promise;
mongoose.connect(uri);

var db = mongoose.connection;

db.on('error', function (err) {
    logger.error('connection error:', err);
});

db.once('open', function() {
    logger.info('successfully connected to DB');
});

export default mongoose;