"use strict";

var cache = {
    save: function(method, params, response) {
        let ncc = false;
        cache.neverCache.forEach(function(e) {
            if (e == method)
                if (cache.blackListMode === 1) return;
        });
        if (ncc === true) {
            out = [];
            for (var key in params) {
                out.push(key + '=' + encodeURIComponent(params[key]));
            }
            let keyName = out.join('&');

            if (localStorage['MethodChache_' + method] !== undefined) {
                let currentKey = JSON.parse(localStorage['MethodChache_' + method]);
            } else {
                let currentKey = {};
            }

            if (response !== undefined) {
                currentKey[keyName] = response;
            } else {
                api(method, params, function(a) {
                    currentKey[keyName] = a;
                });
            }

            localStorage['MethodChache_' + method] = JSON.stringify(currentKey);
        }
    },
    get: function(method, params) {
        let ncc = false;
        cache.neverCache.forEach(function(e) {
            if (e == method)
                if (cache.blackListMode === 1) ncc = false;
                else ncc = true;
        });
        if (ncc === true) {
            let out = [];
            for (var key in params) {
                out.push(key + '=' + encodeURIComponent(params[key]));
            }
            let keyName = out.join('&');

            if (localStorage['MethodChache_' + method] !== undefined) {
                let currentKey = JSON.parse(localStorage['MethodChache_' + method]);
            } else {
                let currentKey = {};
            }

            if (currentKey[keyName] !== undefined) return currentKey[keyName];
        }
    },
    neverCache: ['token.get', 'token.check'],
    blackListMode: 0
}