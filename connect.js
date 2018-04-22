"use strict";

function api(method, params, callback, pars) {
  if (!pars) pars = {};
  if (!params) params = {};

  if (app.token) params['token'] = app.token;
  if (app.settings.__settings_keep_offline_status !== undefined && app.settings.__settings_keep_offline_status == 1) params['hide_online_status'] = 1;

  let boundary = String(Math.random()).slice(2);
  let boundaryMiddle = '--' + boundary + '\r\n';
  let boundaryLast = '--' + boundary + '--\r\n'

  let body = ['\r\n'];

  for (var key in params) {
    if (params[key] && params[key].toLocaleString() == "[object File]") {formDataSender(method, params, callback, pars); return;}
    body.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n' + params[key] + '\r\n');
  }

  body = body.join(boundaryMiddle) + boundaryLast;

  let url = app.domain + 'api/method/' + method;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);

  xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;



    if (xhr.status != 200) {
      console.error(xhr.status + ': ' + xhr.statusText);
      debug.stackDebugData.push('[API CONNECTION ERROR]: '+xhr.status + ': ' + xhr.statusText);
      if (!pars.errorConnectFunc) snack.show(_('server_connect_error'));
      else pars.errorConnectFunc();
    } else {
      let json = JSON.parse(xhr.responseText);
      if (app.debug) {
        if (json.error_code !== undefined) {
          console.error(json);
          debug.stackDebugData.push('[API ERROR]: '+xhr.responseText);
        } else {
          console.log(json);
          debug.stackDebugData.push('[API RESPONSE]: '+xhr.responseText);
        }
      }
        
      if (json.error_code !== undefined) {
        snack.show(json[_("api_error_value")]);
        if (json.error_code === 4 && document.location.hash != '#/login') {
          auth.logout();
          if (app.debug) debug.stackDebugData.push('Login error');
          throw "Response: aborting action";
        }
        if (pars && pars.errorFunc != undefined) pars.errorFunc(json);
      }
      if (callback !== undefined) callback(json);
    }

  }

  xhr.send(body);

}

function xhr(url, callback, onerror) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send();

  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;



    if (xhr.status != 200) {
      console.error(xhr.status + ': ' + xhr.statusText);
      debug.stackDebugData.push('[XHR CONNECTION ERROR]: '+xhr.status + ': ' + xhr.statusText);
      if (onerror !== undefined) onerror();
    } else {
      if (app.debug) debug.stackDebugData.push('[XHR]: '+xhr.responseText);
      if (callback !== undefined) callback(xhr.responseText);
    }

  }
};

function formDataSender(method, params, callback, pars) {
  if (!FormData) {
    patterns.error(_('unsupported_operation')); 
    return;
  }
  params['token'] = app.token;
  let data = new FormData;
  for (var key in params) {
    data.append(key, params[key]);
  }
  let url = app.domain + 'api/method/' + method;
  
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) return;
  
  
  
      if (xhr.status != 200) {
        console.error(xhr.status + ': ' + xhr.statusText);
        debug.stackDebugData.push('[FD CONNECTION ERROR]: '+xhr.status + ': ' + xhr.statusText);
        snack.show(_('server_connect_error'));
      } else {
        if (app.debug) debug.stackDebugData.push('[FD]: '+xhr.responseText);
        let json = JSON.parse(xhr.responseText);
        if (app.debug)
          if (json.error_code !== undefined) console.error(json);
          else console.log(json);
        if (json.error_code !== undefined) {
          if (app.debug) debug.stackDebugData.push('[FD API ERROR]: '+xhr.responseText);
          snack.show(json[_("api_error_value")]);
          if (json.error_code === 4 && document.location.hash != '#/login') {
            auth.logout();
            if (app.debug) debug.stackDebugData.push('Login error');
            throw "Response: aborting action";
          }
          if (pars.errorFunc != undefined) pars.errorFunc(json);
        }
        if (pars && callback !== undefined) callback(json);
      }
  
    }

    xhr.send(data);

} 