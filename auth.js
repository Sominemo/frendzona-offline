"use strict";

var auth = {
    check: function(callback) {
        app.token = localStorage.getItem('__app_authData_token');
        if (auth.tokenSize()) {
            api('token.check', {hide_online_status: 1}, function(a) {
                if (a.correct === 1) {
                    user.id = a.user_id;
                    api('users.get', {user_fields: 'avatar,vip,cover,status'},function(b){
                        user = b.response[0];
                        storage.currentUser.saveData(user);
                        ui.sidebarFill(user);
                    });
                    let loginLayer = [].slice.call(document.querySelectorAll('#loginLayer'));
                    loginLayer.forEach(function(e) {
                        e.parentNode.removeChild(e);
                    }, this);
                    if (callback !== undefined) callback(a.correct);
                    else {
                        auth.getAppSettings();
                        linkThinker();
                        updater.check();
                        }
                } else {
                    localStorage.removeItem('__app_authData_token');
                    app.token = '';
                    auth.loginDialog();
                }
            }, {errorConnectFunc: function(){
                user = storage.currentUser.getData();
                ui.sidebarFill(user);
                linkThinker();
            }} );
        } else auth.loginDialog();
    },
    loginDialog: function() {
        window.location.hash = '#/login';
        app.changeWindowPrepare();
        ui.loading();
        document.title = 'Вход';
        loginLayer = [].slice.call(document.querySelectorAll('#loginLayer'));
        loginLayer.forEach(function(e) {
            e.parentNode.removeChild(e);
        }, this);
        var loginLayer = document.createElement('div');
        loginLayer.id = 'loginLayer';
        loginLayer.innerHTML = '<div class="popup-container"><div class="contents"><div class="site_auth_name">FrendZona</div><input id="Authlogin" placeholder="Email" class="text"><br><input id="AuthPassword" type="password" placeholder="Пароль" class="text"><br>'+(!app.uwp_mode ? '<button id="loginButton"  data-hint="login" data-hint-translate="1"><icon data-hint-child="1">arrow_forward</icon></button>' : '<button id="loginButton" class="button">'+_('login')+'</button>')+'</div></div>';
        let body = document.body;
        body.appendChild(loginLayer);
        document.getElementById('loginButton').onclick = auth.login;
    },
    login: function() {
        let email = document.getElementById('Authlogin').value;
        let pass = document.getElementById('AuthPassword').value;
        api('token.get', {
            mail: email,
            password: pass,
            app_id: 1,
            secret: '60knpK5GgP'
        }, function(a) {
            if (a.token) {
                localStorage.setItem('__app_authData_token', a.token);
                auth.check();
                auth.getAppSettings();
            }
        });
    },
    tokenSize: function() {
        if (app.token !== '' && app.token !== undefined && app.token !== null && app.token.length === 96) return true;
        else return false;
    },
    logout: function(tokendel) {
        if (tokendel !== undefined && tokendel == true) {
            api('token.del');
        }
        localStorage.clear();
        app.token = '';
        app.settings = {
            "__settings_keep_offline_status": 1
        };
        auth.loginDialog();
        snack.show(_('logout_snack'));
        app.setting_keys.forEach(function(a) {
            if (app.settings[a.name] !== undefined) {
                a.disabled = 0;
            }
            });
    },

    getAppSettings: function(f) {
        api('data.getAll', {hide_online_status: 1}, function(a){
            app.settings = a.data;
            app.setting_keys.forEach(function(a) {
                if (app.settings[a.name] == undefined) {
                    api('data.save', {keys: a.name, values: a.default}, function(){
                        api('data.getAll', {}, function(a){
                            app.settings = a.data;
                            if (f !== undefined) f(a.data, app.setting_keys);
                        })
                    });
                }
            });
            app.setting_keys.forEach(function(e) {
                if (app.settings[e.name] !== undefined && e.func !== undefined) {
                    settings.changes[e.func](app.settings[e.name]);
                }
            });
        });
    }
}