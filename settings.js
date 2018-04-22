var settings = {
    open: function() {
        if (Object.keys(app.settings).length === 0) {
            popup.show(_('settings_arent_loaded_yet'), _('error'));
            dialogs.open();
            return;
        }
        ui.sidebar(0);
        settingsContent = document.createElement('div');
        settingsBox = document.createElement('div');
        settingsBox.classList.add('settingsBox');
        //settingsContent.innerHTML += '<div class="settings_header">'+_("settings")+'</div>';
        // Settings content
        
        app.setting_keys.forEach(function(a) {
            if (app.settings[a.name] !== undefined ) {

                if (a.type == 'switch') {
                    if (a.froze === 'vip') {
                        if (user.vip === 1) {
                            a.disabled = 0;
                        } else {
                            a.disabled = 1;
                        }
                    }

                    if (a.froze === 'no_uwp') {
                        if (!app.uwp_mode) {
                            a.disabled = 0;
                        } else {
                            a.disabled = 1;
                        }
                    }

                    settingsBox.innerHTML += switcher(a.name, _(a.display), app.settings[a.name], a.disabled, a.frozen_click_alert);
                }

                if (a.type == 'field') {
                    settingsBox.innerHTML += '<div class="settings_text_block settings_block">'+(a.localized ? _(a.text) : a.text)+'</div>';
                }
            }
            });

        // END: Settings content
        SettingsDoc = document.createElement('div');
        SettingsDoc.classList.add('settingsDoc');
        SettingsDoc.innerHTML = '<button class="button" onclick="settings.save(%popup_id%)">'+_('save')+'</button><button class="button light" onclick="popup.hide(%popup_id%)">'+_('cancel')+'</button>';
        settingsContent.appendChild(settingsBox);
        settingsContent.appendChild(SettingsDoc);
        popup.show(settingsContent.innerHTML, _("settings"));
    },

    save: function(push) {
        keys = [];
        values = [];
        errors = [];
        app.setting_keys.forEach(function(a){
            switch (a.type) {
                case 'switch':
                if (a.disabled != 1) {
                    keys.push(a.name);
                    values.push(+document.getElementById(a.name).checked);
                    if (a.function != undefined) settings.changes[a.func](+document.getElementById(a.name).checked, true);
                    } else {
                        if (document.getElementById(a.name).checked != a.default) {
                            if (a.force != undefined) {
                                keys.push(a.name);
                                values.push(a.force);
                            }
                            errors.push(a.display);
                        }
                    }
                    break;
            
                default:
                    break;
            }
        });
        api('data.save', {keys: keys.join(','), values: values.join(',')}, function(a){
            auth.getAppSettings();
            popup.hide(push);
            snack.show(_('changes_are_saved'));
            if (errors.length != 0) {
                list = '';
                errors.forEach(function(a){list += '• '+_(a)+'<br>';});
                snack.show(_('but_we_coludnt_save_some_items')+':<br>'+list);
            }
        });
    },

    data: {
        save: function(a) {
            let keys = [];
            let data = [];
            Object.keys(a).map(function(key){
                keys.push(key);
                data.push(a[key]);
                api('data.save', {keys: keys.join(','), values: data.join(',')}, function(b){
                    auth.getAppSettings();
                });
            });
        },
        get: function(a) {
            return app.settings[a] ? app.settings[a] : false;
        }
    },
    
    changes: {
        __setting_offline: function(a) {
        if (a == 1) {
            api('account.offline', {});
        }
    },

        __setting_night_theme: function(a) {
            if (a == 1 && !app.uwp_mode) {
                if (document.getElementById("night-theme-css") == null) {
                    app.data.nightTag = document.createElement("link");
                    app.data.nightTag.rel = "stylesheet";
                    app.data.nightTag.id = "night-theme-css";
                    app.data.nightTag.href = "night.css?"+Math.random();
                    document.getElementsByTagName("head")[0].appendChild(app.data.nightTag);
                    document.querySelector('meta[name="theme-color"]').content = "#000000";
                    document.body.classList.add("night-theme");
                    if (window.elor) {
                        window.elor.changeTheme(1);
                        alert(window.elor.getAppBuild());
                    }
                }
            } else {
                if (document.getElementById("night-theme-css") !== null) {
                    app.data.nightTag = document.getElementById("night-theme-css");
                    app.data.nightTag.parentNode.removeChild(app.data.nightTag);
                    document.querySelector('meta[name="theme-color"]').content = "#34BFB0";
                    document.body.classList.remove("night-theme");
                    if (window.external && window.external.notify) window.external.notify("theme_default");
                    if (window.elor) {
                        window.elor.changeTheme(0);
                        alert(window.elor.getAppBuild());
                    }
                    
                }
            }
        },
        __setting_apply_pwa_default: function(a, c) {
            if (!c) { debug.log('Setting PWA as default is getting only at apply', 'settings'); return; }
            if (a == 1) {
                api('app.executeWebCoreChanges', {'changeType': 'redirectNotificationToPWA', value: 1});
            } else {
                api('app.executeWebCoreChanges', {'changeType': 'redirectNotificationToPWA', value: 0});
            }
        },
        __click_pro_feature_alert: function() {
            patterns.error(_('this_feature_requires_pro_dialog'), _('this_feature_requires_pro_dialog_title'), {bgImage: 'res/images/pro_feature.png', bgColor: '#34BFB0'});
        },
        __not_supported_in_this_mode_alert: function() {
            patterns.error(_('not_supported_yet_in_this_mode'), _('not_supported'), {bgImage: 'res/images/settings_error.png', bgColor: '#34BFB0'});
        }
}
}