var snack = {
    textBuffer: [],
    displayed: 0,
    show: function(text) {
        if (snack.displayed && text !== undefined) {
            snack.textBuffer.push(text);
        } else {
            if (text !== undefined) snack.textBuffer.push(text);
            if (snack.textBuffer.length > 0) {
                document.getElementById('snackbar-text').innerHTML = snack.textBuffer[0];
                document.getElementById('snackbar').classList.add('active');
                snack.displayed = 1;
                snackCloseTimer = setTimeout(function() {
                    snack.close();
                }, 5000);
            }
        }
    },
    close: function() {
        document.getElementById('snackbar').classList.remove('active');
        setTimeout(function() {
            clearTimeout(snackCloseTimer);
            snack.textBuffer.splice(0, 1);
            document.getElementById('snackbar-text').innerHTML = '';
            snack.displayed = 0;
            snack.show();
        }, 100);
    }
}

var popup = {
    displayed: [],
    show: function(text, name, params) {
        params = params || {};
        if (params.bgImage && !params.imageWasLoaded) {
            let bgImage = new Image;
            bgImage.src = params.bgImage;
            params.imageWasLoaded = 1;
            bgImage.onload = function() {popup.show(text,name,params);};
            return;
        }
        var random_id = Math.random();
        lpopup = document.createElement('div');
        lpopup.className = 'popup-container';
        lpopup.id = "popup-" + random_id;
        if (name === undefined) name = '';
        let body = '';
        if (params.bgImage && params.bgColor) {lpopup.style.padding = 0; lpopup.style.borderRadius = 0;}
        if (params.bgImage && params.bgColor) body += '<div class="headStyledPopup" style="background-image: url(\''+params.bgImage+'\'); background-repeat: no-repeat; background-color: '+params.bgColor+'; height: 150px; color: white; '+(!params.fullSizeBg ? 'background-size: auto 60%; background-position-x: 0; background-position-y: 65%; padding: 10px; ' : 'background-size: cover; padding: 15px;') + ' padding-bottom: 10%; text-shadow: 0 1px 4px rgba(0,0,0,0.7);">';
        body +=  '<div class="settings_header"><div class="settings_title">' + name + '</div><icon class="addripple blackripple" onclick="popup.hide(' + random_id + ')">close</icon></div>';
        if (params.bgImage && params.bgColor) body += '</div>';
        body +=  '<div class="contents'+(params.beautifyPtag ? ' bpt-padding' : '')+'"'+(params.bgImage && params.bgColor ? ' style="padding: 20px; max-width: calc(100% - 40px);"' : '')+'>' + text.split('%popup_id%').join(random_id);
        if (params.buttons) body += '<div class="settingsDoc">'+params.buttons.split('%popup_id%').join(random_id)+'</div>';
        body += '</div>';
        lpopup.innerHTML = body;
        document.getElementById('popups').appendChild(lpopup);
        popup.displayed.push(random_id);
        document.getElementById('popups').classList.add('active');
        document.getElementById('popups').onclick = function(a) {
            if (!a.target.matches("#popups *")) {
                let clickFunc = a.target.getAttribute('onclick');
                if (clickFunc === null || clickFunc.indexOf('popup.hide') == -1) {
                    popup.hideAll();
                }
            }
        }
        setTimeout(function() {
            document.getElementById('popups').style.opacity = 1;
            if (params && params.onReadyFunc) params.onReadyFunc();
        }, 50);
    },

    hide: function(id) {
        doc = document.getElementById("popup-" + id);
        let theid = popup.displayed.indexOf(id);
        popup.displayed.splice(theid, 1);
        if (popup.displayed.length == 0) {

            document.getElementById('popups').style.opacity = '';
            setTimeout(function() {
                doc.parentElement.removeChild(doc);
                document.getElementById('popups').innerHTML = '';
                document.getElementById('popups').classList.remove('active');
            }, 200);
        } else {
            doc.parentElement.removeChild(doc);
        }
    },

    hideAll: function() {
        document.getElementById('popups').style.opacity = '';
        setTimeout(function() {
            document.getElementById('popups').innerHTML = '';
            document.getElementById('popups').classList.remove('active');
            popup.displayed = [];
        }, 200);
    }

}

var actions = {
    show: function(x, y, s, data) {
        actions.hideAll();
        box = document.createElement("div");
        box.classList.add("actions_box");
        box.style.top = (y + 3) + 'px';
        box.style.left = (x + 3) + 'px';
        box.id = "actions" + Math.random();
        data.forEach(function(a) {
            item = document.createElement("div");
            item.classList.add("actionsItem");
            item.onclick = function(m) {
                a[2](s);
            };

            icon = document.createElement("icon");
            icon.classList.add("ActionItemIcon");
            icon.innerHTML = a[0];
            item.appendChild(icon);

            ItemName = document.createElement("div");
            ItemName.classList.add("ActionItemName");
            ItemName.innerHTML = a[1];
            item.appendChild(ItemName);

            box.appendChild(item);

        });
        box.style.opacity = '0';
        document.body.appendChild(box);
        let d = 0;
        if (box.offsetWidth >= window.innerWidth - x - 30) {
            box.style.left = (x - box.offsetWidth) + 'px';
            d = 1;
        }
        if (box.offsetHeight >= window.innerHeight - y - 100) box.style.top = (y - box.offsetHeight) + 'px';
        if ((x + box.offsetWidth > window.innerWidth && d == 0) || (x < box.offsetWidth && d == 1)) {
            box.style.width = 'calc(100% - 10px)';
            box.style.left = 0;
            box.style.right = 0;
            box.style.margin = '5px';
        }
        setInterval(function() {
            box.style.opacity = '';
        }, 0);
    },
    hideAll: function() {
        [].slice.call(document.getElementsByClassName("actions_box")).forEach(function(a) {
            document.body.removeChild(a);
        });
    }
}

var notification = {
    textBuffer: [],
    displayed: 0,
    show: function(text, action) {
        if (notification.displayed && text !== undefined) {
            notification.textBuffer.push(text);
        } else {
            if (text !== undefined) notification.textBuffer.push(text);
            if (notification.textBuffer.length > 0) {
                document.getElementById('notification-text').innerHTML = notification.textBuffer[0];
                if (action !== undefined) document.getElementById('notification-box').onclick = function(a) {
                    notification.close();
                    action(a);
                };
                document.getElementById('notification-box').classList.add('active');
                notification.displayed = 1;
                notificationCloseTimer = setTimeout(function() {
                    notification.close();
                }, 5000);
            }
        }
    },
    close: function() {
        document.getElementById('notification-box').classList.remove('active');
        setTimeout(function() {
            clearTimeout(notificationCloseTimer);
            notification.textBuffer.splice(0, 1);
            document.getElementById('notification-text').innerHTML = '';
            document.getElementById('notification-text').onclick = undefined;
            notification.displayed = 0;
            notification.show();
        }, 100);
    }
}

function switcher(name, display, checked, disabled, onclick, params) {
    let param = params || {};
    return '<div class="switch_block settings_block"' + (disabled ? " onclick=settings.changes." + onclick + "()" : "") + '><input class="switch_checkbox" type="checkbox" value="1" id="' + name + '" ' + (checked !== undefined && checked == 1 ? 'checked' : '') + ' ' + (disabled !== undefined && disabled == 1 ? 'disabled' : '') + '><label for="' + name + '"'+(param.left ? ' class="left"': '')+'>' + display + '</label></div>';
}

var hint = {
    reaction: function(e) {
        if (!hint.current || !hint.object.contains(e.relatedTarget)) {
            let target = e.target;
            if (target.getAttribute('data-hint-child')) target = target.parentNode;
            let text = target.getAttribute('data-hint');
            if (!text) return;

            let theHint = document.createElement('div');
            theHint.classList.add("hint");
            theHint.innerHTML = target.getAttribute('data-hint-translate') ? _(text) : text;
            document.body.appendChild(theHint);

            let coords = target.getBoundingClientRect();

            let left = coords.left + (target.offsetWidth - theHint.offsetWidth) / 2;
            let hintPos = target.getAttribute('data-hint-position');
            if (hintPos === 'left') left = coords.left;
            if (hintPos === 'right') left = coords.left + target.offsetWidth;
            if (left < 0) left = 5;
            if (left + theHint.offsetWidth + 20 > window.innerWidth) left = window.innerWidth - theHint.offsetWidth - 20;

            let top = coords.top - theHint.offsetHeight - 5;
            if (top < 0) top = coords.top + target.offsetHeight + 5;

            theHint.style.left = left + 'px';
            theHint.style.top = top + 'px';

            hint.current = theHint;
            hint.object = target;
            theHint.classList.add('hidden');
            setTimeout(function() {
                theHint.classList.remove('hidden');
                theHint.classList.add('showed');
            }, 200);
        }

    },
    close: function(e) {
        if (hint.current != false && !hint.object.contains(e.target)) {
            hint.current.classList.add('die');
            hint.current.classList.remove('showed');
            setTimeout(function() {
                [].slice.call(document.getElementsByClassName("hint")).forEach(function(a) {
                    a.parentElement.removeChild(a);
                });
                hint.current = false;
            }, 200);
        }
    },
    closeAll: function() {
        [].slice.call(document.getElementsByClassName("hint")).forEach(function(a) {
            hint.current.classList.add('die');
            hint.current.classList.remove('showed');
        });
        setTimeout(function() {
            [].slice.call(document.getElementsByClassName("hint")).forEach(function(a) {
                a.parentElement.removeChild(a);
            });
            hint.current = false;
            hint.object = false;
        }, 200);
    },
    current: false,
    object: false
}

var patterns = {
    error: function(a, b, c, d) {
        b = b || _('error');
        d = d || {};
        popup.hideAll();
        let img = new Image;
        img.src = 'res/images/alert.png';
        img.onload = function() {
            setTimeout(function() {
                popup.show('<div style="display: flex;vertical-align:  middle;"><div><img src="res/images/alert.png" style="max-width: 100px; width:100%;"></div><div style="    vertical-align: middle; display: flex; flex-direction: column; justify-content: center; padding: 10px; padding-top: 0;"><span style="'+(!d.customFontSize ? 'font-size: 20px;' : 'font-size: '+d.customFontSize+'px;')+'">' + a + '<span></div></div>', b, c);
            }, 300);
        }
    }
}