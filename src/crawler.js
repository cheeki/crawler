import {Stock, TYPE} from './model/stock';
import {logger} from './service/logger';
import {accessPageAndDoTasks, _page} from './page';
import path from 'path';

// replace the value below with the Telegram token you receive from @BotFather
const screenshotDir = path.resolve(__dirname, '../screenshots');
const jQueryPath = 'bower_components/jquery/dist/jquery.js';

/** helpers **/
const click = (selector) => {
    let promise = new Promise( (resolve, reject) => {
        _page.evaluate((selector) => {
            document.querySelector(selector).click();
        }, selector);

        waitUntil(/\/{2}(?!nid)/, () => resolve());
    });

    return promise;
};

const waitUntil = (regexp, callback) => {
    var intervalTimer = setInterval(() => {
        var pageUrl = _page.evaluate(() => {
            return location.href;
        });

        if (pageUrl && regexp.test(pageUrl) ) {
            clearInterval(intervalTimer);
            callback();
        }
    }, 10);
};

const save = (list, type, callback) => {
    let cnt = 0,
        length = list.length;

    for ( let item of list ) {
        item.type = type;
        let newItem = new Stock(item);
        newItem.save(() => {
            cnt++;
            if (cnt === length && typeof callback === "function") {
                callback();
            }
        });
    }
};

/** tasks **/
const parseIntlStock = () => {
    _page.render(path.resolve(screenshotDir, './1.main.png'));

    return _page.evaluate(() => {
        var list = [];

        $(".aside_stock tbody>tr").each(function () {
            var $this = $(this),
                name = $this.find("th").text(),
                $cells = $this.find("td"),
                value = parseFloat($cells.eq(0).text().replace(",", "")),
                change = $cells.eq(1)
                    .clone()    //clone the element
                    .children() //select all the children
                    .remove()   //remove all the children
                    .end()  //again go back to selected element
                    .text();

            change = parseFloat(change.replace(",", ""));

            if ($this.hasClass("down")) {
                change = -change;
            }

            list.push({name, value, change});
        });

        return list;
    });
};

const parseTodayStock = () => {
    return _page.evaluate(() => {
        let list = [],
            indexes = {
                kosdaq: {
                    selector: '.kosdaq_area',
                    name: '코스닥'
                },
                kospi: {
                    selector: '.kospi_area',
                    name: '코스피'
                },
                kospi200: {
                    selector: '.kospi200_area',
                    name: '코스피200'
                }
            };

        for(let index in indexes) {
            let $header = $(`.section_stock ${indexes[index].selector} .heading_area a`).eq(1),
                $values = $header.find('.num_quot'),
                name = indexes[index].name,
                value = parseFloat($values.find('.num').text()),
                change = parseFloat($values.find('.num2').text()),
                changeRate = $values.find('.num3')
                    .clone()    //clone the element
                    .children() //select all the children
                    .remove()   //remove all the children
                    .end()  //again go back to selected element
                    .text();

            if(!$values.hasClass("up")) {
                change = -change;
                changeRate = -changeRate;
            }

            list.push({name, value, change, changeRate});
        }

        return list;
    });
};

const moveToLoginPage = () => {
    return _page.open("https://nid.naver.com/nidlogin.login");
};

const goToMyStock = () => {
    _page.render(path.resolve(screenshotDir, './3.afterlogin.png'));
    return _page.open('http://finance.naver.com/mystock/itemList.nhn');
};

const fillLoginForm = () => {
    _page.render(path.resolve(screenshotDir, './2.loginform.png'));
    return _page.evaluate( (id, pw) => {
        $("id").value = id;
        $("pw").value = pw;
    }, process.argv[2], process.argv[3]);
};

const submitLogin = () => {
    _page.render(path.resolve(screenshotDir, './2.2.loginform.png'));

    return click(".btn_global", 2000);
};

const parseMystock = () => {
    _page.render(path.resolve(screenshotDir, './4.mystock.png'));

    return _page.evaluate(() => {
        let list = [];
        $("#itemForm table>tbody>tr").each((i, elem) => {
            let $this = $(elem),
                $tds = $this.find("td"),
                parseNumber = ($element) => {
                    return parseFloat($element.text().replace(",", ""));
                },
                item = {
                    name: $tds.eq(0).text(),
                    value: parseNumber($tds.eq(1)),
                    change: parseNumber($tds.eq(2)),
                    changeRate: parseNumber($tds.eq(3)),
                    volume: parseNumber($tds.eq(4)),
                    marketCap: parseNumber($tds.eq(5)),
                    per: parseNumber($tds.eq(6)),
                    evaluated: parseNumber($tds.eq(7)),
                    evaluatedRate: parseNumber($tds.eq(8))
                };

            if ($tds.eq(2).hasClass("point_dn")) {
                item.change = -item.change;
            }
            list.push(item);
        });

        return list;
    });
};

const injectjQuery = () => {
    return _page.injectJs(jQueryPath);
};

const saveIntl = (list) => {
    logger.info(`[CRAWLER] parsed intl stocks: ${JSON.stringify(list)}`);
    save(list, TYPE.INTL);
    return list;
};

const saveMyStock = (list) => {
    logger.info(`[CRAWLER] parsed my stocks: ${JSON.stringify(list)}`);
    save(list, TYPE.MY);
    return list;
};

const saveTodayStock = (list) => {
    logger.info(`[CRAWLER] parsed today stocks: ${JSON.stringify(list)}`);
    save(list, TYPE.TODAY);
    return list;
};

export const crawl = ( cb ) => {
    accessPageAndDoTasks( cb,
        injectjQuery,
        parseIntlStock,
        saveIntl,
        parseTodayStock,
        saveTodayStock,
        moveToLoginPage,
        fillLoginForm,
        submitLogin,
        goToMyStock,
        injectjQuery,
        parseMystock,
        saveMyStock
    );
};
