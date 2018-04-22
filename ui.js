var ui = {
    sidebar: function(a) {
        sidebar = document.getElementById('sidebar');
        if (a === undefined) app.sidebar_opened = sidebar.classList.toggle('sidebar-shown');
        else if (a === 1) app.sidebar_opened = sidebar.classList.add('sidebar-shown');
        else if (a === 0) app.sidebar_opened = sidebar.classList.remove('sidebar-shown');


    },
    sb_update: function() {
        if (window.location.hash.indexOf(':') === -1) end_srch = window.location.hash.length;
        else end_srch = window.location.hash.indexOf('||');
        app.window = window.location.hash.substring(2, end_srch);
        [].slice.call(document.querySelectorAll('.sidebar-item')).forEach(function(a) {
            a.classList.remove('selected')
        });
        try {
            if (document.querySelector('.sidebar-item#' + app.window + '-sidebar') !== null) document.querySelector('.sidebar-item#' + app.window + '-sidebar').classList.add('selected');
        } catch (e) {}
    },
    loading: function() {
        ui.sidebar(0);
        document.getElementById("main").innerHTML = '<div class="centration-div"> <svg width="56px" height="56px" version="1" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"> <style type="text/css">.qp-circular-loader { width:28px; height:28px; } .qp-circular-loader-path { stroke-dasharray: 58.9; stroke-dashoffset: 58.9; } .qp-circular-loader, .qp-circular-loader * { -webkit-transform-origin: 50% 50%; } /* Rotating the whole thing */ @-webkit-keyframes rotate { from {-webkit-transform: rotate(0deg);} to {-webkit-transform: rotate(360deg);} } .qp-circular-loader { -webkit-animation-name: rotate; -webkit-animation-duration: 1568.63ms; -webkit-animation-iteration-count: infinite; -webkit-animation-timing-function: linear; } /* Filling and unfilling the arc */ @-webkit-keyframes fillunfill { from { stroke-dashoffset: 58.8; } 50% { stroke-dashoffset: 0; } to { stroke-dashoffset: -58.4; } } @-webkit-keyframes rot { from { -webkit-transform: rotate(0deg); } to { -webkit-transform: rotate(-360deg); } } @-webkit-keyframes colors { from { stroke: #34BFB0; } to { stroke: #34BFB0; } } .qp-circular-loader-path { -webkit-animation-name: fillunfill, rot, colors; -webkit-animation-duration: 1333ms, 5332ms, 5332ms; -webkit-animation-iteration-count: infinite, infinite, infinite; -webkit-animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), steps(4), linear; -webkit-animation-play-state: running, running, running; -webkit-animation-fill-mode: forwards; }</style> <g class="qp-circular-loader"> <path class="qp-circular-loader-path" d="M 14,1.5 A 12.5,12.5 0 1 1 1.5,14" fill="none" stroke-linecap="square" stroke-width="3"/> </g> </svg> </div>';
    },
    mainClear: function() {
        document.getElementById("main").innerHTML = '';
    },
    sb_highlight: function(a) {
        try {
            if (document.querySelector('.sidebar-item#' + a + '-sidebar') !== null) document.querySelector('.sidebar-item#' + a + '-sidebar').classList.add('selected');
        } catch (e) {}
    },

    loading_svg: function(a, b, c) {
        b = b || '#34BFB0';
        c = c || '';
        return (c !== '' ? '<div style="'+c+'">' : '')+'<svg width="'+a+'px" height="'+a+'px" version="1" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"> <style type="text/css">.qp-circular-loader { width:28px; height:28px; } .qp-circular-loader-path { stroke-dasharray: 58.9; stroke-dashoffset: 58.9; } .qp-circular-loader, .qp-circular-loader * { -webkit-transform-origin: 50% 50%; } /* Rotating the whole thing */ @-webkit-keyframes rotate { from {-webkit-transform: rotate(0deg);} to {-webkit-transform: rotate(360deg);} } .qp-circular-loader { -webkit-animation-name: rotate; -webkit-animation-duration: 1568.63ms; -webkit-animation-iteration-count: infinite; -webkit-animation-timing-function: linear; } /* Filling and unfilling the arc */ @-webkit-keyframes fillunfill { from { stroke-dashoffset: 58.8; } 50% { stroke-dashoffset: 0; } to { stroke-dashoffset: -58.4; } } @-webkit-keyframes rot { from { -webkit-transform: rotate(0deg); } to { -webkit-transform: rotate(-360deg); } } @-webkit-keyframes colors { from { stroke: '+b+'; } to { stroke: '+b+'; } } .qp-circular-loader-path { -webkit-animation-name: fillunfill, rot, colors; -webkit-animation-duration: 1333ms, 5332ms, 5332ms; -webkit-animation-iteration-count: infinite, infinite, infinite; -webkit-animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), steps(4), linear; -webkit-animation-play-state: running, running, running; -webkit-animation-fill-mode: forwards; }</style> <g class="qp-circular-loader"> <path class="qp-circular-loader-path" d="M 14,1.5 A 12.5,12.5 0 1 1 1.5,14" fill="none" stroke-linecap="square" stroke-width="3"/> </g> </svg>'+(c !== '' ? '</div>' : '');
    },
    sidebarFill: function(user) {
        document.getElementById('sidebar-head-avatar').style.backgroundImage = "url('"+user.avatar+"')";
        document.getElementById('sidebar-header').style.backgroundImage =  "url('"+user.cover+"')";
        document.getElementById('sidebar-head-user-name').innerText = user.name + ' ' + user.surname;
        document.getElementById('sidebar-head-user-status').innerHTML = (user.status ? engines.text.normalize(user.status) : '<div style="opacity: 0.8">'+_('status')+'</div>');
        document.getElementById('sidebar-head-avatar').onclick  = function(){profile.open()};
        document.getElementsByClassName('sidebar-name-data')[0].onclick = function(){profile.open()};
    }
}