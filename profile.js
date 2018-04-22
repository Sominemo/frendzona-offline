"use strict";

var profile = {
    open: function(user_id) {
        if (!user_id) user_id = user.id;
        api('users.get', {user_id: user_id, user_fields: 'online,avatar,status'}, function(a){
            if (a.response[0] !== undefined) {
                a = a.response[0];
                let contents = '<div class="profile-header"><div class="head-ava"><img src="'+a.avatar+'"></div><div class="head-name"><div class="thename">'+a.name+' '+a.surname+'</div><div class="onlinestatus">'+(a.online == 0 ? _('last_online')+': '+engines.timeDisplay.get(a.visit) : _('online') + (a.mobile === 1 ? ' ' + _('from_mobile') : ''))+'</div></div></div>'+(a.status !== undefined ?'<div class="profile-status">'+engines.text.links(engines.text.normalize(a.status))+'</div>' : '');
                
                if (user_id != user.id) {
                contents += '<button class="button" disabled><icon>people</icon> '+_('add_to_friends')+'</button>';
                contents += '<button class="button" onclick="popup.hide(%popup_id%); im.linkOpen('+user_id+')"><icon>mail</icon> '+_('write_message')+'</button>';
                }
                
                popup.show(contents, _('profile'));
            }
        });
    }
}