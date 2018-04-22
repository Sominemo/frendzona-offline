'use strict';

var debug = {
    stackDebugData: [],
    log: function(a, b, p) {
        if (!app.debug) return;
        p = p || {};
        let l = this.data[b];
        switch (l.type) {
            case 'groups':
            debug.stackDebugData.push("%c["+l.mark+"]: "+JSON.stringify(a));
            console.groupCollapsed("%c["+l.mark+"]: "+p.title, 'color: '+l.color);
            for (let key in l.items) {
                let it = l.items[key];
                console.groupCollapsed(it.name+" ("+a[key].length+")");
                a[key].forEach(e => {
                    switch (it.type) {
                        case 'warn':
                        console.warn(e);
                        break;
                        case 'error':
                        console.error(e);
                        break;
                        default:
                        console.log(e);
                        break;
                    }
                });
                console.groupEnd();
            }
            console.groupEnd();
                break;

            case 'text':
            let e = "%c["+l.mark+"]: "+a;
            debug.stackDebugData.push("["+l.mark+"]: "+a);
            let s = "color:"+l.color;
            switch (p.type) {
                case 'warn':
                console.warn(e, s);
                break;
                case 'error':
                console.error(e, s);
                break;
                default:
                console.log(e, s);
                break;
            }
            break;

            default:
                break;
        }
    },
    data: {
        offline: {
            type: "groups",
            mark: "offline.js",
            color: "#ff0098",
            items: {
                data: {
                    name: "Data",
                    type: "log"
                },
                stored: {
                    name: "Stored",
                    type: "log"
                },
                errors: {
                    name: "Errors",
                    type: "error"
                },
                dublicates: {
                    name: "Dublicates",
                    type: "warn"
                }
            }
        },
        im: {
            type: "text",
            mark: "im.js",
            color: "#f4bf00"
        },
        engines: {
            type: "text",
            mark: "engines.js",
            color: "#6bc400"
        },
        linkThinker: {
            type: "text",
            mark: "linkThinker.js",
            color: "#00c4a3"
        },
        sw: {
            type: "text",
            mark: "sw.js",
            color: "#5b00c4"
        },
        storage: {
            type: "text",
            mark: "offline.js",
            color: "#ff0098"
        },
        language: {
            type: "text",
            mark: "language.js",
            color: "#00bcd4"
        },
        settings: {
            type: "text",
            mark: "settings.js",
            color: "#33691E"
        }
    },
    sendWindow: function() {
        popup.show(_('send_logs_window_question', {n: debug.stackDebugData.length})+"<p id=\"send-logs-progress\"></p>", _('send_logs_to_fz'), {buttons: '<button class="button" onclick="debug.send()">'+_('send')+'</button><a class="button light" onclick="popup.hideAll()">'+_('cancel')+'</a>', beautifyPtag: true});
    },
    send: function() {
        document.getElementById("send-logs-progress").innerHTML = _('sending')+'...';
        api('app.sendLog', {data: JSON.stringify(debug.stackDebugData), device: navigator.userAgent, type: 1, code: 'Offline report'}, popup.hideAll);

    }
}
    
    window.onerror = function (msg, url, lineNo, columnNo, error) {
        var string = msg.toLowerCase();
        var substring = "script error";
        if (string.indexOf(substring) > -1){
            alert('Script Error: See Browser Console for Detail');
        } else {
            var message = [
                'Message: ' + msg,
                'URL: ' + url,
                'Line: ' + lineNo,
                'Column: ' + columnNo,
                'Error object: ' + JSON.stringify(error)
            ].join(' - ');
    
            debug.stackDebugData.push(message);
        }
    
        return false;
    };