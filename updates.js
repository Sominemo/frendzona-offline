var longPoll = {

    start: function() {
        while (app.longPoll.activated === true) {

        }
    },

    check: function(page) {
        if (page === undefined) page = 1;
        api('messages.longPoll', {
            time: app.longPoll.lastCheck,
            offset: page,
            user_fields: 'avatar'
        }, function(r) {

        })
    }
}