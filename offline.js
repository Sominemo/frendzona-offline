'use strict';

var storage = {
    engines: {
        getUIDkey: function(uid) {
            return '__Messages_cache_uid'+uid;
        }
    },
    messages: {
        saveMessages: function(uid, data) {
            if (!uid) return;
            let debugData = {stored: [], dublicates: [], errors: [], data: data};
            let key = storage.engines.getUIDkey(uid);
            let dbData = localStorage.getItem(key);
            
            let dbWork = {dialogData: {}, messages: []};

            if (dbData !== null) {
                dbWork = JSON.parse(dbData);
            }
            data.forEach(function(e) {
                if(e.peer_user.id !== uid) {debugData.errors.push(e); return;};
                let srch = dbWork.messages.filter(function(obj){return obj.id === e.id;});
                if(srch[0] && srch[0].id === e.id) {debugData.dublicates.push(e); return;};
                dbWork.messages.push(e);
                debugData.stored.push(e);
            });

            localStorage.setItem(key, JSON.stringify(dbWork));
            debug.log(debugData, 'offline', {title: "DB.Messages Save Report [UID: "+uid+"]"});
        },
        sortMessages: function(uid) {
            let key = storage.engines.getUIDkey(uid);
            let dbData = localStorage.getItem(key);

            if (dbData === null) return [];
            dbData = JSON.parse(dbData);

            let msg = dbData.messages;

            msg = msg.sort(function(msg1, msg2) {
                msg1.id - msg2.id;
            });

            dbData.messages = msg;
            localStorage.setItem(key, JSON.stringify(dbData));   
            return msg;         

        },
        getMessages: function(uid) {
            let key = storage.engines.getUIDkey(uid);
            let dbData = localStorage.getItem(key);

            if (!dbData) return [];

            let res = storage.messages.sortMessages(uid);
            return res;
        },
        find: function(id, uid) {
            return storage.messages.sortMessages(uid).findIndex((e) => e.id === id);            
        },
        remove: function(id, uid) {
            let i = this.find(id, uid);
            let key = storage.engines.getUIDkey(uid);
            let dbData = localStorage.getItem(key);

            let dbWork = {dialogData: {}, messages: []};

            if (dbData !== null) {
                dbWork = JSON.parse(dbData);
            }

            if (i !== -1) {
                dbWork.messages.splice(i, 1);
            }
            
            localStorage.setItem(key, JSON.stringify(dbWork));  
            debug.log('Element #'+i+' has been removed (M-ID: '+id+'/'+uid+')', 'storage');

        },
        clearCache: function() {
            Object.keys(localStorage).filter((e) => (e+'').indexOf('__Messages_cache_') !== 1).forEach(m => localStorage.removeItem(m));
        }
    },
    currentUser: {
        key: '__app_userCahe',
        getData: function() {
            let m = localStorage.getItem(this.key);

            if (m === null) m = '{"id":0,"name":"UNKNOWN","surname":"USER","avatar_full":"https://frendzona.info/design/img/noavatar.png","avatar":"https://frendzona.info/design/img/noavatar.png","avatar_mini":"https://frendzona.info/design/img/noavatar.png","vip":0,"cover":"https://frendzona.info/design/img/no_obkl.jpg","status":""}';
            
            let data = JSON.parse(m);

            return data;
        },
        saveData: function(data) {
            localStorage.setItem(this.key, JSON.stringify(data));
        }
    },
    usersData: {
        getUIDkey: function(uid) {
            return '__Users_cache_uid'+uid;
        },
        get: function(uid) {
            let key = this.getUIDkey(uid);
            let dbData = localStorage.getItem(key);
            

            if (dbData === null) dbData = '{"id":0,"name":"UNKNOWN","surname":"USER","avatar_full":"https://frendzona.info/design/img/noavatar.png","avatar":"https://frendzona.info/design/img/noavatar.png","avatar_mini":"https://frendzona.info/design/img/noavatar.png","vip":0,"cover":"https://frendzona.info/design/img/no_obkl.jpg","status":""}';
            
            return JSON.parse(dbData);
        },
        save: function(data) {

            if (!data.id) return;

            localStorage.setItem(this.getUIDkey(data.id), JSON.stringify(data));

        }
    }
}

var offlineFeatures = {

install: function() {
    if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js', {scope: '/'}).then(function(reg) {
      debug.log('SW Registration Successful - ' + reg.scope, 'sw');
    }).catch(function(error) {
      debug.log('[sw.js]: SW Registration Failed - ' + error, 'sw');
    });
  }; 
}

}
offlineFeatures.install();