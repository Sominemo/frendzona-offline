"use strict";

function api(method, params, callback) {


  var out = [];
  for (var key in params) {
    out.push(key + '=' + encodeURIComponent(params[key]));
  }
  out.push('token=' + encodeURIComponent(app.token));
  if (app.settings.__settings_keep_offline_status !== undefined && app.settings.__settings_keep_offline_status == 1) out.push('hide_online_status=' + encodeURIComponent('1'));
  let param = out.join('&');

  let url = app.domain + 'api/method/' + method + '?' + param;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send();

  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;



    if (xhr.status != 200) {
      console.error(xhr.status + ': ' + xhr.statusText);
      snack.show(_('server_connect_error'));
    } else {
      let json = JSON.parse(xhr.responseText);
      if (app.debug)
        if (json.error_code) console.error(json);
        else console.log(json);
      if (json.error_code) {
        snack.show(json[_("api_error_value")]);
        if (json.error_code === 4 && document.location.hash != '#/login') {
          auth.logout();
          throw "Response: aborting action";
        }
      }
      if (callback !== undefined) callback(json);
    }

  }

}

function xhr(url, callback, onerror) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send();

  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;



    if (xhr.status != 200) {
      console.error(xhr.status + ': ' + xhr.statusText);
      if (onerror !== undefined) onerror();
    } else {
      if (callback !== undefined) callback(xhr.responseText);
    }

  }
}