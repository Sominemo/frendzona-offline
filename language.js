"use strict";

var _ = function(index, p) {
    p = p || {};
    if (_.prototype.langLib.main[index] !== undefined) {
        return _.prototype.replacer(_.prototype.langLib.main[index], p);
    } else {
        debug.log('Can\'t find index ['+index+']', 'language');
        patterns.error(_('you_have_old_language_pack'), undefined, {bgImage: 'res/images/update_header.png', bgColor: '#34BFB0'});
        return '['+index+']';
    }
}

_.prototype.langLib = {
    main: {
        cant_load_lang: "Unable to load language pack",
        you_have_old_language_pack: "Perhaps you saved an old version of the language pack for FrendZona Offline. Try clearing the cache and reloading the page"
    }
};


_.prototype.loadLang = function(onLoad) {
    let lng = localStorage.getItem('__settings_app_language');
    if (lng === 'ua') app.lang = 'ua';
    else app.lng = 'ru';
    xhr(app.lang + '.json', function(a) {
        var l = JSON.parse(a);
        _.prototype.langLib = l;
        for (var i in _.prototype.langLib.auto_change) {
            [].slice.call(document.querySelectorAll('#' + i)).forEach(function(p) {
                p.innerHTML = _.prototype.langLib.auto_change[i];
            });
        };
        if (onLoad !== undefined) onLoad();
    }, function() {
        snack.show(_('cant_load_lang'));
    });
}

_.prototype.toggle = function() {
    var lng = localStorage.getItem('__settings_app_language');
    if (lng === 'ru') app.lang = 'ua';
    else app.lang = 'ru';
    localStorage.setItem('__settings_app_language', app.lang);
    _.prototype.loadLang();
}

_.prototype.replaceLib = {
    'replace::app_version': app.version,
    'replace::app_build': app.build
};

_.prototype.replacer = function(text, p) {
    if (typeof p === "object") {
        let k = Object.keys(p); 
        k.forEach((e) => { 
            text = text.split("{%" + e.toString() + "%}").join(p[e].toString()); 
        });
    }
    Object.keys(_.prototype.replaceLib).forEach(function(a) {
        text = text.split('%'+a+'%').join(_.prototype.replaceLib[a].toString());
    });
    return text;
}