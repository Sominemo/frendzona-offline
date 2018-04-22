"use strict";

var dialogs = {
    open: function() {
        window.location.hash = "#/dialogs";
        app.changeWindowPrepare();
        document.title = _('dialogs');
        document.getElementById("head-text").innerText = _('dialogs');
        ui.loading();
        api('messages.getDialogs', {
            offset: 1,
            user_fields: 'avatar,online'
        }, function(a) {
            ui.mainClear();

            let writeBtn = document.createElement('div');
            writeBtn.classList.add('floating_button');
            let writeBtnIcon = document.createElement('icon');
            writeBtnIcon.innerText = 'edit';
            writeBtn.setAttribute("data-hint", "new_message");
            writeBtn.setAttribute("data-hint-translate", "1");
            writeBtnIcon.setAttribute("data-hint-child", "1");
            writeBtn.setAttribute("data-hint", "new_message");
            writeBtn.appendChild(writeBtnIcon);
            writeBtn.onclick = friends.open;
            document.getElementById("main").appendChild(writeBtn);

            app.scrollingFunc = function() {
                let st = window.pageYOffset;
                if (st == 0 || st < app.data.lastScrollTop) {
                    document.querySelector('.floating_button').style.transform = ''; 
                } else {
                    document.querySelector('.floating_button').style.transform = 'translateY(200%)';
                }
                app.data.lastScrollTop = st;
            }

            app.data.last = [];
            app.data.other = [];
            a.dialogs.forEach(function(e) {
                if (e.message.time > Math.floor(Date.now() / 1000) - 86400) app.data.last.push(e);
                else app.data.other.push(e);
            });
            let dialogsRoot = document.createElement('div');
            dialogsRoot.id = 'dialogs_list';
            app.data.main = dialogsRoot;
            app.data.main = document.getElementById('main');
            if (app.data.last.length !== 0) {
                app.data.title = document.createElement('div');
                app.data.title.className = 'section';
                app.data.title.innerHTML = _('last');

                app.data.dialogsList = document.createElement('div');
                app.data.dialogsList.id = 'dialogs_last';
                app.data.dialogsList.className = 'card';

                app.data.main.appendChild(app.data.title);
                app.data.dialogsList = main.appendChild(app.data.dialogsList);

                app.data.last.forEach(function(e) {
                    app.data.peer = dialogs.generatePeerLink(e);
                    app.data.dialogsList.appendChild(app.data.peer);
                });
            }

            if (app.data.other.length !== 0) {
                app.data.title = document.createElement('div');
                app.data.title.className = 'section';
                app.data.title.innerHTML = _('earlier');

                app.data.dialogsList = document.createElement('div');
                app.data.dialogsList.id = 'dialogs_earlier';
                app.data.dialogsList.className = 'card';

                app.data.main.appendChild(app.data.title);
                app.data.dialogsList = main.appendChild(app.data.dialogsList);

                app.data.other.forEach(function(e) {
                    app.data.peer = dialogs.generatePeerLink(e);
                    app.data.dialogsList.appendChild(app.data.peer);
                });
            }
            app.data.offset = 1;
            dialogs.load();
            app.onscrollFunc = dialogs.load;

        });
    },
    generatePeerLink: function(e) {
        app.data.time_output = app.data.icon_output = '';
        app.data.time_output = engines.timeDisplay.get(e.message.time);
        if (e.message.out) {
            if (e.message.unread === 1) app.data.icon_output = '<icon>done</icon>';
            else app.data.icon_output = '<icon>done_all</icon>';
        } else {
            if (e.counter > 0) app.data.icon_output = '<div class="counter">' + e.counter + '</div>';

        }
        app.data.peer = document.createElement('a');
        app.data.peer.id = 'dialog_' + e.user.id;
        app.data.peer.href = '#/im' + e.user.id;
        app.data.peer.setAttribute("time", e.message.time);
        app.data.peer.className = 'card-item';
        app.data.peer.innerHTML = '<div class="content dialog-card"><div id="avatar"><img src="' + e.user.avatar + '"></div> <div id="message">  <div class="user-name">' + e.user.name + ' ' + e.user.surname + '</div> <div id="message-main"><div id="message-text">' + (e.user.id !== e.message.user_sender.id ? '<img src="' + e.message.user_sender.avatar + '" class="avatar-mini">' : '') + engines.text.simplify(engines.text.normalize(e.message.text, true)) + '</div></div>  </div> <div id="m-info"><div id="time">' + app.data.time_output + '</div><div id="status">' + app.data.icon_output + '</div></div></div>';
        return app.data.peer;
    },

    load: function() {
        app.data.offset++;
        api('messages.getDialogs', {
            offset: app.data.offset,
            user_fields: 'avatar,online'
        }, function(a) {
            app.data.lastLoad = [];
            app.data.otherLoad = [];
            a.dialogs.forEach(function(e) {
                if (e.time > Math.floor(Date.now() / 1000) - 86400) {
                    app.data.last.push(e);
                    app.data.lastLoad.push(e);
                } else {
                    app.data.other.push(e);
                    app.data.otherLoad.push(e);
                }
            });
            if (app.data.last.length === 0 && app.data.lastLoad.length !== 0) {
                app.data.main = document.getElementById('main');
                app.data.title = document.createElement('div');
                app.data.title.className = 'section';
                app.data.title.innerHTML = _('last');

                app.data.dialogsList = document.createElement('div');
                app.data.dialogsList.id = 'dialogs_last';
                app.data.dialogsList.className = 'card';

                app.data.main.appendChild(app.data.title);
                app.data.dialogsList = main.appendChild(app.data.dialogsList);
            }

            app.data.lastLoad.forEach(function(e) {
                app.data.peer = dialogs.generatePeerLink(e);
                app.data.dialogsList.appendChild(app.data.peer);
            });


            if (app.data.other.length === 0 && app.data.otherLoad.length !== 0) {
                app.data.main = document.getElementById('main');
                app.data.title = document.createElement('div');
                app.data.title.className = 'section';
                app.data.title.innerHTML = _('earlier');

                app.data.dialogsList = document.createElement('div');
                app.data.dialogsList.id = 'dialogs_earlier';
                app.data.dialogsList.className = 'card';

                app.data.main.appendChild(app.data.title);
                app.data.dialogsList = main.appendChild(app.data.dialogsList);
            }

            app.data.otherLoad.forEach(function(e) {
                app.data.peer = dialogs.generatePeerLink(e);
                app.data.dialogsList.appendChild(app.data.peer);
            });

        });

    }
}