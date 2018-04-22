var updater = {
    check: function(){
        api('app.lastVersion', {}, function(a){
            if (a.build > app.build) {
                popup.show('<div style="font-weight: bold; font-size: 30px;">'+_('update_is_ready_to_install')+'</div><div style="color: #afafaf;">'+a.date+'</div><br><b>'+_('changelog')+'</b><br><pre>'+a[_('changelog_var')]+'</pre>', _('modules_manager'), {bgImage: 'res/images/update_header.png', bgColor: '#34BFB0', buttons: '<button class="button" onclick="updater.clearAndUpdate()">'+_('to_update')+'</button><a class="button light" onclick="popup.hideAll()">'+_('cancel')+'</a>'});
            }
        });
    },
    clearAndUpdate: function() {
        if (navigator.serviceWorker.controller === null) {window.location.reload(true); return;}  
            navigator.serviceWorker.controller.postMessage("update");
            offlineFeatures.install();
            window.location.reload(true);        
    }
}