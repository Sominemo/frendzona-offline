"use strict";

window.addEventListener('load', function() {
    var hamburger = document.getElementById('hamburger-content-block');
    var sidebar_back = document.getElementById('sidebar-back-button-content-block');
    hamburger.onclick = sidebar_back.onclick = function() {
        ui.sidebar();
    }
    document.getElementById('snackbar-close').onclick = snack.close;
    _.prototype.loadLang(auth.check);
    window.addEventListener("click", function(a) {

        if (app.sidebar_opened && !a.target.matches('#sidebar, #sidebar *, #sidebar-header, #sidebar-header *, #hamburger-content-block, #hamburger-content-block *')) {
            ui.sidebar(0);
        }

        if (!a.target.matches('.--actions-clickable, .--actions-clickable-child *:not(.--actions-do-not-click), .--actions-clickable *:not(.--actions-do-not-click)')) {
        actions.hideAll();
        }

    });
    window.onhashchange = function(v) {
        linkThinker(v);
        if (app.sidebar_opened) ui.sidebar(0);
    }

    app.lang = localStorage.getItem('__settings_app_language');
});

window.addEventListener('error', function(message, url, lineNumber) {
 if (app.mobile_debug == true)    alert("Error: " + message + "\n(" + url + ":" + lineNumber + ")");
});


document.addEventListener('scroll', function() {
    actions.hideAll();
    hint.closeAll();

});

document.addEventListener("touchstart",function(a) {
    setTimeout(function() {
        if (a.touchstart == true)
            document.oncontextmenu(a);
    }, 500);
});

document.addEventListener("contextmenu", function(a) {
    actions.hideAll();
    let theclick = a.target;
    /*
    if (a.target.matches('.message-container .message-text') && a.ctrlKey != true) {
        a.preventDefault();
       return im.messageActions(a);
    }
    */
    if ((a.target.matches('#messages-send-button') || a.target.matches('#messages-send-button *') || a.target.matches('#attachLabel--messages')) && a.ctrlKey != true) {
        im.flipAction();
        a.preventDefault();
        return false;
    }

    if (a.target.matches('.messages-bar') && a.ctrlKey != true) {
        actions.show(a.clientX, a.clientY, theclick, [
            ["attach_file", _('attach_file'), im.attach]
        ]);
        a.preventDefault();
        return false;
    }
});

document.addEventListener('mouseover', hint.reaction);
document.addEventListener('mouseout', hint.close);

document.addEventListener('click', function(a) {
    hint.closeAll();
});

window.addEventListener('keyup',function(e) {
    if (e.keyCode == 27 && popup.displayed.length > 0) {
        popup.hideAll();
    }
})

document.addEventListener('touchstart', function(event) {
//event.preventDefault();
//event.stopPropagation();
app.swipe_data.initialPoint=event.changedTouches[0];
}, false);
document.addEventListener('touchend', function(event) {
//event.preventDefault();
//event.stopPropagation();
app.swipe_data.finalPoint=event.changedTouches[0];
var xAbs = Math.abs(app.swipe_data.initialPoint.pageX - app.swipe_data.finalPoint.pageX);
var yAbs = Math.abs(app.swipe_data.initialPoint.pageY - app.swipe_data.finalPoint.pageY);
if (xAbs > 20 || yAbs > 20) {
if (xAbs > yAbs) {
if (app.swipe_data.finalPoint.pageX < app.swipe_data.initialPoint.pageX) {
// ToLeft
ui.sidebar(0);
} else {
// ToRight
if (app.swipe_data.initialPoint.pageX <= window.innerWidth * 0.2 && app.swipe_data.finalPoint.pageX - app.swipe_data.initialPoint.pageX > window.innerWidth * 0.2 )
ui.sidebar(1);
}
} else {
if (app.swipe_data.finalPoint.pageY < app.swipe_data.initialPoint.pageY) {
// ToTop
} else {
// ToBottom
}
}
}
}, false);