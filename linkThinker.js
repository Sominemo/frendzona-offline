"use strict";

function linkThinker(a) {
    let act = 0;
    let linkReg = '';
    debug.log('Hash -> '+window.location.hash, 'linkThinker');
    if (window.location.hash == "") window.location.hash = '#/dialogs';

    if (window.location.hash.indexOf("#/dialogs") === 0) {
        dialogs.open();
        act = 1;
    }

    if (window.location.hash.indexOf("#/friends") === 0) {
        friends.open();
        act = 1;
    }

    if (window.location.hash.indexOf("#/login") === 0 && auth.tokenSize()) {
        dialogs.open();
        act = 1;
    }

    if (window.location.hash.indexOf("#/settings") === 0 && auth.tokenSize()) {
        settings.open();
        act = 1;
    }
    
        if (window.location.hash.indexOf("#/testPage") === 0 && auth.tokenSize()) {
        testEngine.open(); 
        act = 1;
    }

    

    if (window.location.hash.indexOf("#/login") === 0) act = 1;
    if (window.location.hash.indexOf("#/player") === 0) {
        act = 1;
        player.app.build();
    }

    if ((linkReg = window.location.hash.match(/^#\/im(\d+)/i)) !== null) {
        im.open(linkReg[1]);
        act = 1;
    }

    if ((linkReg = window.location.hash.match(/^#\/profile(\d+)/i)) !== null) {
        profile.open(linkReg[1]);
        act = 1;
    }

    if (act === 0) {
        app.changeWindowPrepare();
        let main = document.getElementById('main');
        let card404 = '<div class="centration-div" style="flex-direction: column; opacity: 0; transition: all .2s;"><img src="res/images/undefined_error.png" style="height: 10em;"><div style="padding: 10px; text-align: center;">'+_('undefined_error')+'</div><div><button class="button light" onclick="history.back()">'+_('go_back')+'</button><button class="button" onclick="window.location.hash=\'\'">'+_('main_page')+'</button></div></div>';
        card404 = main.innerHTML = card404;
        let img = new Image;
        img.src = 'res/images/undefined_error.png';
        img.onload = function(){
            document.querySelector('.centration-div').style.opacity = 1;
        }
    }
}