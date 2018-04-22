"use strict";

var engines = {
        copy: function(s) {
            window.getSelection().selectAllChildren(s);
            let CopyResult = document.execCommand('copy');
            if (CopyResult == true) snack.show(_('copied'));
            else snack.show(_('unable2copy'));
            if (window.getSelection) window.getSelection().removeAllRanges();
            else if (document.selection) document.selection.empty();
        },

        elements: {
            find: function(el, query) {
                el = [].slice.call(el.children);

                el.forEach(e => {
                    if (e.matches(query)) return e;
                });
                return false;
            }
        },

        text: {
            normalize: function(a, ignore_linebreaks) {
                a = a.toString();
                a = a.replace(/&amp;/g, '&');
                if (ignore_linebreaks === undefined || !ignore_linebreaks) a = a.replace(/&lt;br \/&gt;/g, '<br>');
                else a = a.replace(/&lt;br \/&gt;/g, ' ');
                return a;
            },

            links: function(a) {
                try {
                    a = a.replace(/((http(s)?:\/\/)?(www\.)?[a-zA-Zа-яА-Я0-9_-]+\.[a-zA-Zа-яА-Я]{2,}([A-Za-zа-яА-Я0-9_~!*'"();:@&=+$,/?#%-\/]*)\/?)/g, function(a) {
                        return ('<a href="' + (a.search(/http(s)?:\/\//) !== 0 ? 'http://' + a : a) + '" onclick="window.open(this.href); return false" class="--actions-do-not-click" title="' + decodeURIComponent(a).replace(/"/g, '&quot;') + '">' + decodeURIComponent(a).substring(0, 100) + (decodeURIComponent(a).length != decodeURIComponent(a).substring(0, 100).length ? '...' : '') + '</a>')
                    });
                } catch (e) {
                    debug.log('Bad link detected', 'engines');
                };
                a = a.replace(/\[id([0-9]+)I([а-яА-Яa-zA-Z./?!@"#]+)\]/g, '<a onclick="profile.open($1)" style="text-decoration: underline; cursor: pointer;" class="--actions-do-not-click">$2</a>');
                return a;
            },

            simplify: function(a) {
                return a.replace(/\[id([0-9]+)I([а-яА-Яa-zA-Z./?!@"#]+)\]/g, '$2');
            }
        },


            timeDisplay: {
                get: function(a, ext) {
                    if (ext === undefined) ext = 0;
                    let h, m, r, d, y = '';
                    let now1 = new Date();
                    let show = new Date(a * 1000);
                    if ((Date.now() - a * 1000) <= 86400000 && ext < 1 && now1.getDate() === show.getDate()) {
                        r = engines.timeDisplay.time(a);
                    } else if (ext < 1) {
                        r = engines.timeDisplay.date(a);
                    } else if (ext == 1) {
                        r = engines.timeDisplay.date(a) + ' ' + engines.timeDisplay.time(a);
                    } else if (ext == 2) {
                        if ((Date.now() - a * 1000) <= 86400000 && now1.getDate() === show.getDate()) {
                            r = engines.timeDisplay.time(a);
                        } else {
                            r = engines.timeDisplay.date(a) + ' ' + engines.timeDisplay.time(a);
                        }
                    }
                    return r;
                },

                time: function(a) {
                    var h, m, r, d, y = '';
                    a = new Date(a * 1000);
                    h = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
                    m = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
                    r = h + ':' + m;
                    return r;
                },

                date: function(a, f) {
                    let h, m, r, d, y = '';
                    a = new Date(a * 1000);
                    d = a.getDate() < 10 ? '0' + a.getDate() : a.getDate();
                    m = a.getMonth() + 1 < 10 ? '0' + (a.getMonth() + 1) : a.getMonth() + 1;
                    y = a.getFullYear();
                    let now = new Date;
                    if (f || y != now.getFullYear()) r = d + '/' + m + '/' + y;
                    else r = d + '/' + m;
                    return r;
                }
            }
        }