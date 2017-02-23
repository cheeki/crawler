import {logger} from './service/logger';
import config from '../config/config';
import phantom from 'phantom';

const requestURL = config.url;
export let _page;

export function accessPageAndDoTasks ( cb, ...tasks ) {
    let _ph;

    let instance = phantom.create().then((ph) => {
        _ph = ph;
        return _ph.createPage();
    }).then(page => {
        _page = page;
        return _page.open(requestURL);
    }).then(status => {

        logger.info(`[ACCESS][PROCESSING] page loading...`);

        _page.property('onConsoleMessage', function(msg) {
            console.log('console: ' + msg);
        });

        return _page.property('content');
    });

    for(let task of tasks) {
        instance = instance.then((...args) => {
            if(args) {
                console.log(task);
            }
            return task.apply(null, args);
        });
    }

    instance.then( (...result) => {
        logger.info('[ACCESS][DONE]');
        if (typeof cb === "function") {
            cb(result);
        }
        _page.close();
        _ph.exit();
    }).catch(e => console.log(e));
}