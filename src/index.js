/**
 * @file MIP缓存删除
 * @author xuexb <fe.xiaowu@gmail.com>
 */

import {parse} from 'url';
import request from 'request';

export default class MipCache {
    constructor(options = {}) {
        if (!options.authkey) {
            throw new TypeError('options.authkey is empty');
        }

        this.options = options;
    }

    /**
     * 解析url
     *
     * @param  {string} url 链接
     *
     * @return {string}
     */
    _parseUrl(url) {
        if ('string' !== typeof url) {
            throw new TypeError('url is not string');
        }

        let urlData = parse(url);

        url = `${urlData.hostname || ''}${urlData.pathname || ''}`;

        if (!url) {
            throw new TypeError('url is empty');
        }

        return url;
    }

    /**
     * 清空缓存
     *
     * @param  {string} url 链接
     *
     * @return {Promise}
     */
    clear(url) {
        url = this._parseUrl(url);

        return new Promise((resolve, reject) => {
            request.post(`http://mipcache.bdstatic.com/update-ping/c/${url}`, {
                form: {
                    key: this.options.authkey
                }
            }, (error, response, body) => {
                if (error) {
                    return reject({
                        status: -1,
                        msg: error || 'server error'
                    });
                }

                try {
                    body = JSON.parse(body);
                }
                catch (e) {
                    body = {
                        status: -2,
                        msg: 'parse json error'
                    };
                }

                // 如果有错误
                if (body.error) {
                    return reject({
                        status: body.status,
                        msg: body.msg || 'server code error'
                    });
                }

                resolve(body);
            });
        });
    }
}
