import Express from 'express';
import {Stock, TYPE} from '../../model/stock';
import {crawl} from '../crawler';

var router = Express.Router();

router.get('/getToday', (req, res) => {
    Stock.findByType(TYPE.TODAY, (err, obj) => {
        if(err) {
            res.status(400).send();
        }
        res.send(obj);
    });
});

router.get('/getMy', (req, res) => {
    Stock.findByType(TYPE.MY, (err, obj) => {
        if(err) {
            res.status(400).send();
        }
        res.send(obj);
    });
});

router.get('/getIntl', (req, res) => {
    Stock.findByType(TYPE.INTL, (err, obj) => {
        if(err) {
            res.status(400).send();
        }
        res.send(obj);
    });
});


router.get('/fetch', (req, res) => {
    crawl(() => {
        res.status(200).send();
    });
});

router.get('/', (req, res) => {
    res.render("index.html");
});

module.exports = router;