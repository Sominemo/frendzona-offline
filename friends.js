"use strict";

var friends = {
    open: function() {
        window.location.hash = "#/friends";
        app.onscrollFunc = friends.load;
        app.changeWindowPrepare();
        document.title = _('friends');
        document.getElementById("head-text").innerText = _('friends');
        ui.loading();
        api('friends.get', {
            offset: 1,
            user_fields: 'avatar,online'
        }, function(a) {
            ui.mainClear();
            app.data.main = document.getElementById('main');
            app.data.friendsList = document.createElement('div');
            app.data.friendsList.id = 'friends_list';
            app.data.friendsList.className = 'card';
            app.data.friendsList = app.data.main.appendChild(app.data.friendsList);
            a.response.forEach(function(e) {
                app.data.friend = friends.generateFriendCard(e);
                app.data.friendsList.appendChild(app.data.friend);

            });
            app.data.offset = 1;
            friends.load();
        });
    },
    generateFriendCard: function(e) {
        app.data.friend = document.createElement('a');
        app.data.friend.id = 'user_' + e.id;
        app.data.friend.onclick = function() {profile.open(e.id)};
        app.data.friend.className = 'card-item';
        app.data.friend.innerHTML = '<div class="content friend-card"><div id="avatar"><img src="' + e.avatar + '"></div> <div id="info">  <div class="user-name">' + e.name + ' ' + e.surname + '</div> <div id="tasks"></div>  </div></div>';
        return app.data.friend;
    },

    load: function() {
        app.data.offset++;
        api('friends.get', {
            offset: app.data.offset,
            user_fields: 'avatar,online'
        }, function(a) {
            a.response.forEach(function(e) {
                app.data.friendsList = document.getElementById('friends_list');
                app.data.friend = friends.generateFriendCard(e);
                app.data.friendsList.appendChild(app.data.friend);

            })
        });
    }
}