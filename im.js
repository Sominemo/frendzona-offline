"use strict";

/*

                    <ОБРАЩЕНИЕ К АНДРЕЮ И ВСЕЙ КОМАНДЕ /ТЗ>
     Глубокоуважаемый Андрей и вся команда /ТЗ, Я провел глубочайший анализ
    всех Ваших сообщений. В результате я дедуктивным методом пришел к выводу,
    что Вы когда-либо увидите этот текст, интересуясь исходным кодом FZ Offline.
    Прошу Вас, уважаемый (или нет) читатель, если Вы не являетесь Андреем - не
    информируйте его о существовании этого текста - дайте ему шанс найти его
    самостоятельно. 
     Уже на протяжении длительного времени длится разработка FZ Offline. Открою
    Вам тайну: разработка также ведется для диссертации на Малую Академию Наук.
    Все замечания к коду присылайте в Trello на доску FZ Offline по ссылке
    ниже:
    https://trello.com/invite/fzona/0abd862eeefc62dd731666a2f1f091d9
     В каждом моем продукте есть пасхалка. Запомните: В КАЖДОМ. Иногда в виде
    комментариев, иногда в виде скрытых фич или смены UI. Но они всегда есть.
     Кстати, я бы хотел заметить, что Андрей - пидор. В плохом смысле. На этом
    все, уважаемый (или нет) читатель. Спускайся ниже и изучай код в тех целях,
    с которыми ты открывал этот файл. Удачи (или нет) тебе.

    Программист Сергей.

*/

var im = {
    linkOpen: function(id) {
        window.location.hash = "#/im"+id;
    },
    open: function(id) {
        app.changeWindowPrepare();
        ui.loading();
        ui.sb_highlight("dialogs");
        id = parseInt(id) || 0;
        api('users.get', {
            user_id: id,
            user_fields: 'online'
        }, function(a) {
            app.onscrollFunc = im.onScroll;
            ui.mainClear();
            document.title = a.response[0].name + " " + a.response[0].surname;
            document.getElementById("head-text").innerText = a.response[0].name + " " + a.response[0].surname;
            document.getElementById("sub-head-text").innerText = (a.response[0].online ? _('online') : _('offline'));
            document.getElementById("titler").onclick = function() {profile.open(id)};
            let messagesBox = document.createElement("div");
            messagesBox.classList.add("messages-box");
            let main_container = document.getElementById('main');
            ui.mainClear();
            main_container.appendChild(messagesBox);
            api('messages.get', {
                peer_id: id
            }, function(b) {
                storage.messages.saveMessages(id, b.response);
                b.response.forEach(function(c) {
                    im.genMsg(c);
                });
                let msgBar = document.createElement("div");
                msgBar.classList.add("messages-bar");
                main_container.appendChild(msgBar);
                let MessagesinputBar = document.createElement("textarea");
                MessagesinputBar.id = "messages-input";
                MessagesinputBar.rows = 1;
                MessagesinputBar.placeholder = _("enter_your_message");
                msgBar.appendChild(MessagesinputBar);
                let SendButtonAttachInput = document.createElement("div");
                SendButtonAttachInput.classList.add("attachButtonBox");
                let SendButtonAttachInputButton = document.createElement("input");
                SendButtonAttachInputButton.type = "file";
                SendButtonAttachInputButton.id = "sendButtonAttachInput";
                SendButtonAttachInputButton.accept = "image/jpeg, image/png";
                SendButtonAttachInputButton.onchange = im.attach;
                SendButtonAttachInput.appendChild(SendButtonAttachInputButton);
                let AttachLabel = document.createElement("label");
                AttachLabel.id = "attachLabel--messages";
                AttachLabel.setAttribute("for", "sendButtonAttachInput");
                AttachLabel.setAttribute("data-hint", "attach_image");
                AttachLabel.setAttribute("data-hint-translate", "1");
                SendButtonAttachInput.appendChild(AttachLabel);
                msgBar.appendChild(SendButtonAttachInput);
                let MessagesSendButton = document.createElement("div");
                MessagesSendButton.type = "submit";
                MessagesSendButton.id = "messages-send-button";
                MessagesSendButton.classList.add("disabled");
                MessagesSendButton.onclick = im.send;
                app.data.sendButtonAction = 1;
                msgBar.appendChild(MessagesSendButton);
                let SendIcon = document.createElement("icon");
                SendIcon.innerText = "send";
                app.data.sendButtonAction = 1;
                MessagesSendButton.appendChild(SendIcon);

                im.elastic(MessagesinputBar);
                im.flipAction(2);
                MessagesinputBar.addEventListener("keydown", function(event) {
                    if ((event.shiftKey && event.keyCode == 13 && app.settings.__settings_send_by_enter != 1) || (!event.shiftKey && event.keyCode == 13 && app.settings.__settings_send_by_enter == 1)) {
                        event.preventDefault()
                        im.send();
                    } else if (event.shiftKey && event.keyCode == 13 && app.settings.__settings_send_by_enter == 1) {
                        //document.getElementById("messages-input").value = document.getElementById("messages-input").value+'\n';
                        im.sizes(document.getElementById('messages-input'));
                    } else {
                        if (Math.round(Date.now()/1000)-4 >= app.data.lastTypeSent) {api('messages.type', {user_id: app.data.user_id}, function(){
                            app.data.lastTypeSent = Math.round(Date.now()/1000);
                        });}
                    }
                }, false);
                app.onScrollReverse = true;
                app.data.offset = 1;
                app.data.user_id = parseInt(id);
                im.onScroll(1);
                window.scrollTo(0, document.body.scrollHeight + 500);
                document.getElementById("messages-input").focus();
                app.data.updateTime = app.data.type_heared = Math.round(Date.now() / 1000);
                app.data.lastTypeSent = 0;
                app.updateNow = true;
                if (app.settings.__settings_do_not_read_messages == undefined || app.settings.__settings_do_not_read_messages != 1)  im.read();
                im.update();

            })
        });
    },
    genMsg: function(c, d) {
        if (c.attachments !== undefined && d != true) c.attachments.forEach(function(a) {
            im.attachment(a, c.out, (d !== undefined && d == true ? 1 : 0), c.id);
        });

        let messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");
        messageContainer.classList.add("--actions-clickable-child");
        if (c.out) messageContainer.classList.add("out");
        else messageContainer.classList.add("in");
        let message = document.createElement("div");
        message.classList.add("message-text");
        message.setAttribute("data-message-id", c.id);
        message.setAttribute("data-message-time", c.time);
        message.setAttribute("data-message-unread", c.unread);
        message.classList.add("message-effect");
        message.addEventListener('click',function(m){im.messageActions(m)});
        message.innerHTML = im.messageText(c.text, c.edit);
        messageContainer.appendChild(message);
        let messagesBox = document.querySelector('.messages-box');
        if (d !== undefined && d == true) messagesBox.insertBefore(messageContainer, messagesBox.firstChild);
        else { messagesBox.appendChild(messageContainer); }

        if (c.attachments !== undefined && d == true) c.attachments.forEach(function(a) {
            im.attachment(a, c.out, (d !== undefined && d == true ? 1 : 0), c.id);
        });
        setTimeout(function(){message.classList.remove("message-effect"); (d ? window.scrollTo(0, document.body.scrollHeight + 500) : '')}, 100);
    },
    messageText: function(text, edit) {
        return '<div class="msg-content-text">'+engines.text.links(engines.text.normalize(text.toString()))+'</div>'+(edit ? '<icon class="edit_mark" data-hint-translate="1" data-hint="edited">edit</icon>' : '');
    },
    onScroll: function(beg) {
        app.data.offset++;
        if (app.onScrollReverse && window.scrollY < 40 && app.data.scrollEnd == 0) {
            window.scrollTo(0, 80);
        }
        let scrollFix = document.body.scrollHeight;
        api('messages.get', {
            peer_id: app.data['user_id'],
            offset: app.data['offset']
        }, function(b) {
            storage.messages.saveMessages(app.data['user_id'], b.response);
            b.response.forEach(function(c) {
                im.genMsg(c);
                if (beg) {
                    window.scrollTo(0, document.body.scrollHeight + 500);
                }
            });
            if (!b.response.length) {
                if (!app.data.scrollEnd) debug.log('End reached. Unlocking ending pixels', 'im');
                app.data.scrollEnd = 1;
            }
            else app.data.scrollEnd = 0;
            if (!beg && scrollFix <= 100) {
                window.scrollTo(0, document.body.scrollHeight - scrollFix);
            }
        });
    },

    elastic: function(a) {
        a = a || this;
        a.setAttribute('style', 'height:' + 16 + 'px;overflow-y:hidden;');
        a.addEventListener("input", function() {
            a.style.height = 'auto';
            a.style.height = (a.scrollHeight) + 'px';
            document.getElementsByClassName('messages-box')[0].style.paddingBottom = (64 + a.scrollHeight) + 'px';
            window.scrollTo(0, document.body.scrollHeight);
            if (a.value == '' || a.value.match(/^ +$/)) {
                document.getElementById("messages-send-button").classList.add("disabled");
                im.flipAction(2, 1);
            } else {
                document.getElementById("messages-send-button").classList.remove("disabled");
                im.flipAction(1, 1);
            }
        }, false);
    },

    send: function() {
        if (app.data.sendButtonAction == 3) {snack.show(_('sending')); return;}
        let text = document.getElementById("messages-input").value;
        if (text != '' && !text.match(/^ +$/)) {
            im.flipAction(3);
            document.getElementById("messages-input").focus();
            api("messages.send", {
                user_id: app.data.user_id,
                text: text
            }, function() {
                document.getElementById("messages-input").value = '';
                im.sizes(document.getElementById('messages-input'));
                im.flipAction(2);
            });
        }
    },

    attachment: function(a, c, d, i) {
        let messageContainer = document.createElement("div");
        messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");
        if (c) messageContainer.classList.add("out");
        else messageContainer.classList.add("in");
        let message = document.createElement("div");
        message.classList.add("attachment-img");
        messageContainer.setAttribute("data-message-id", i);
        message.classList.add("message-effect");
        message.style.backgroundImage = 'url(' + a.preview_url + ')';
        message.style.backgroundPosition = 'center 100%';
        message.style.backgroundSize = 'auto 100%';
        message.style.backgroundRepeat = 'no-repeat';
        message.style.width = a.params_preview[0] + 'px';
        message.style.height = a.params_preview[1] + 'px';
        messageContainer.appendChild(message);
        let messagesBox = document.querySelector('.messages-box');
        if (d) messagesBox.insertBefore(messageContainer, messagesBox.firstChild);
        else messagesBox.appendChild(messageContainer);
        setTimeout(function(){message.classList.remove("message-effect"); (d ? window.scrollTo(0, document.body.scrollHeight + 500) : '')}, 100);
    },

    update: function(l) {
        if (l === undefined) {
            app.data.updateId = Math.random();
            l = app.data.updateId;
        } else if (app.data.updateId !== l) {
            debug.log('Dialog update #' + (l+'').substr(2) + ' closed', 'im');
            return;
        }
        api('messages.longPoll', {
            peer_id: app.data.user_id,
            time: app.data.updateTime,
            type_heared: app.data.type_heared,
            updates: 'messages,type,changes'
        }, function(a) {
            if (app.data.updateId !== l) {
                debug.log('Dialog update #' + (l+'').substr(2) + ' closed', 'im');
                return;
            }
            if (a.messages.type.length) {
                a.messages.type.forEach(function(b) {
                    if (app.data.user_id === b.user.id) {
                        if (b.time > app.data.type_heared) app.data.type_heared = b.time;
                        im.showTypeStatus(b.time);
                    } else {
                        im.showTypeStatus(false);
                    }
                });
            } else {
                im.showTypeStatus(false);
            }

            storage.messages.saveMessages(app.data.user_id, a.messages.items.new);
            a.messages.items.new.forEach(function(b) {
                if (b.time > app.data.updateTime) app.data.updateTime = b.time;
                im.genMsg(b, 1);
                if (app.settings.__settings_do_not_read_messages == undefined || app.settings.__settings_do_not_read_messages != 1) im.read();
                window.scrollTo(0, document.body.scrollHeight + 500);
            });

            a.messages.items.changes.forEach(function(b){
                if (b.update_time > app.data.updateTime) app.data.updateTime = b.update_time+1;
                if (!b.message.unread) document.querySelector('[data-message-id="'+b.message.id+'"]').setAttribute('data-message-unread', 0);
                
                let newText = im.messageText(b.message.text, b.message.edit);

                if (newText !== document.querySelector('[data-message-id="'+b.message.id+'"] .msg-content-text').innerHTML) document.querySelector('[data-message-id="'+b.message.id+'"] .msg-content-text').innerHTML = newText;
            });

            if (a.messages.items.deleted.length) {
                a.messages.items.deleted.forEach(function(b) {
                    if (b.time > app.data.updateTime) app.data.updateTime = b.time;
                    [].slice.call(document.querySelectorAll('[data-message-id="'+b.message+'"]')).forEach(function(d) {
                        d.parentElement.removeChild(d);
                    });
                    storage.messages.remove(b.message, app.data.user_id);
                });
            }

            im.update(l);
        });
    },
    delDialog: function(a) {
        let m = a.getAttribute('data-message-id');
        let fau = 0;
        if (a.matches('.out *')) {fau = 1;} else {fau = 0;}

        patterns.error(_('delete_message_confirmination')+(fau ? switcher('delete_for_all',_('delete_for_all'),0,0,undefined, {left: 1}) : ''), _('confirmination'), {bgImage: 'res/images/remove_alert.png', bgColor: '#34BFB0', buttons: '<button class="button" onclick="im.delete('+m+')">'+_('delete')+'</button><a class="button light" onclick="popup.hideAll()">'+_('cancel')+'</a>'}, {customFontSize: 14});
    },

    delete: function(a) {
        //let m = a.getAttribute('data-message-id');
        let m = a;
        let fa = (document.getElementById("delete_for_all") !== null ? document.getElementById("delete_for_all").checked : 0);
        api('messages.delete', {
            id: m,
            for_all: fa
        }, function(b) {
            [].slice.call(document.querySelectorAll('[data-message-id="'+m+'"]')).forEach(function(d) {
                d.parentElement.removeChild(d);
            });
            popup.hideAll();
            snack.show(_("deleted"));
        });
    },

    attach: function() {
        app.data.thefile = document.getElementById("sendButtonAttachInput").files[0];
        app.data.filesSend = [app.data.thefile];
        document.getElementById("sendButtonAttachInput").value = '';

        if (app.data.thefile.type.match('image.*')) {
            if (!FileReader) {
                patterns.error(_('unsupported_operation')); 
                return;
            }
        let fr = new FileReader();
        fr.onload = (function(thefile) {
          return function(e) {
              let container = document.createElement('div');

              let textarea = document.createElement('textarea');
              textarea.rows = 3;
              textarea.classList.add("big-textarea");
              textarea.id = "attach-text-area";
              textarea.placeholder = _('add_text')+'...';
              textarea.style.width = '100%';
              container.appendChild(textarea);

              let buttonDoc = document.createElement("div");
              buttonDoc.classList.add("settingsDoc");

              let previewContainer = document.createElement("div");
              previewContainer.id = "AttachPreviews";
              buttonDoc.appendChild(previewContainer);

              let inputPlus = document.createElement("input");
              inputPlus.type = "file";
              inputPlus.id = "moreAttInput";
              inputPlus.accept = "image/jpeg, image/png";
              container.appendChild(inputPlus);

              let attachPlus = document.createElement("label");
              attachPlus.setAttribute("for", "moreAttInput");
              attachPlus.id = "MoreAttLabel";
              attachPlus.innerHTML = '<icon>attach_file</icon>';
              previewContainer.appendChild(attachPlus);

              let preview = document.createElement("div");
              preview.classList.add("previewImage");
              preview.style.backgroundImage = "url('"+e.target.result+"')";
              previewContainer.appendChild(preview);

              let button = document.createElement("button");
              button.className = "button";
              button.id = "attachSendButton";
              button.innerHTML = _('send');
              buttonDoc.appendChild(button);

              container.appendChild(buttonDoc);
              
            popup.show(container.innerHTML,_('attachment'), {bgImage: e.target.result, bgColor: '#FFFFFF', fullSizeBg: true, onReadyFunc: function(){
                document.getElementById("attach-text-area").onkeydown = function(event) {
                    if (!event.shiftKey && event.keyCode == 13) {
                        event.preventDefault()
                        im.sendAttachment();
                    }
                };
                document.getElementById("attachSendButton").onclick = im.sendAttachment;
                document.getElementById("moreAttInput").onchange = im.moreAtt;
    
                setTimeout(function(){document.getElementById("attach-text-area").focus()}, 200);
            }});
          };
        })(app.data.thefile);
   
        fr.readAsDataURL(app.data.thefile);
    } else {
        snack.show(_('u_can_upload_images_only'));
    }
    },

    moreAtt: function() {
        if (app.data.filesSend.length >= 10) snack.show(_('attaches_limit'));
        let thefile = document.getElementById("moreAttInput").files[0];
        app.data.thefile = thefile;
        app.data.filesSend.push(app.data.thefile);
        document.getElementById("sendButtonAttachInput").value = '';

        if (app.data.thefile.type.match('image.*')) {
            if (!FileReader) {
                patterns.error(_('unsupported_operation')); 
                return;
            }
        let fr = new FileReader();
        fr.onload = (function(thefile) {
          return function(e) {
            let preview = document.createElement("div");
            preview.classList.add("previewImage");
            preview.style.backgroundImage = "url('"+e.target.result+"')";
            document.getElementById("AttachPreviews").appendChild(preview);
          }
        })(thefile);
        fr.readAsDataURL(app.data.thefile);
    }
    },

    flipAction: function(a, b) {
        let SendIcon = document.querySelector('#messages-send-button icon');
        let MessagesSendButton = document.getElementById('messages-send-button');
        if (a == undefined) if (app.data.sendButtonAction === 1) a = 2; else a = 1;
        if (b == 1 && a == app.data.sendButtonAction) return;
        if (a === 2) {
            app.data.sendButtonAction = 2;
            MessagesSendButton.onclick = im.attach;
            MessagesSendButton.classList.add("attach");
            MessagesSendButton.classList.remove("send");
            MessagesSendButton.classList.add("animate");
            setTimeout(function() {
                MessagesSendButton.classList.remove("animate");
            }, 200);
            document.getElementsByClassName("attachButtonBox")[0].style.display = 'block';

            SendIcon.innerText = "attach_file";
        } else if (a === 1)  {
            app.data.sendButtonAction = 1;
            MessagesSendButton.onclick = im.send;
            MessagesSendButton.classList.add("send");
            MessagesSendButton.classList.remove("attach");
            MessagesSendButton.classList.add("animate");
            setTimeout(function() {
                MessagesSendButton.classList.remove("animate");
            }, 200);
            document.getElementsByClassName("attachButtonBox")[0].style.display = '';

            SendIcon.innerText = "send";
        } else {
            app.data.sendButtonAction = 3;
            MessagesSendButton.onclick = function(){snack.show(_('sending'))};
            MessagesSendButton.classList.remove("send");
            MessagesSendButton.classList.add("attach");
            MessagesSendButton.classList.add("animate");
            SendIcon.innerHTML = ui.loading_svg(24);
            setTimeout(function() {
                MessagesSendButton.classList.remove("animate");
            }, 200);
            document.getElementsByClassName("attachButtonBox")[0].style.display = '';

        }
    },

    read: function() {
        api('messages.read', {
            user_id: app.data.user_id
        }, function() {
            [].slice.call(document.querySelectorAll('.message-container.in [data-message-unread="1"]')).forEach(function(d){
                d.setAttribute('data-message-unread', 0);
            })
        });
    },

    messageActions: function(a) {
        let target = a.target;
        if (target.matches('.message-text *')) target = a.target.parentElement;
        if ([].slice.call(target.children).findIndex((e) => e.contentEditable == "true") !== -1) return false;

        let action = [];
            action.push(["access_time", engines.timeDisplay.get(parseInt(target.getAttribute('data-message-time')), 1) + ' • ' + (target.getAttribute('data-message-unread') == 1 ? _('is_unread') : _('is_read')), function(){}]);
            if (target.matches(".out *")) action.push(["edit", _('edit'), im.edit]);
            action.push(["content_copy", _('copy'), engines.copy]);
            action.push(["delete", _('delete'), im.delDialog]);

        actions.show(a.x, a.y, target, action);
       // return false;
    },

    sizes: function(a) {
        a.setAttribute('style', 'height:' + 16 + 'px;overflow-y:hidden;');
        a.style.height = 'auto';
        a.style.height = (a.scrollHeight) + 'px';
        document.getElementsByClassName('messages-box')[0].style.paddingBottom = (64 + a.scrollHeight) + 'px';
        window.scrollTo(0, document.body.scrollHeight);
        if (a.value == '' || a.value.match(/^ +$/)) {
            document.getElementById("messages-send-button").classList.add("disabled");
            im.flipAction(2, 1);
        } else {
            document.getElementById("messages-send-button").classList.remove("disabled");
            im.flipAction(1, 1);
        }
    },
    showTypeStatus: function(a) {
        if (a === false) {
            api('users.get', {user_id: app.data.user_id, user_fields: 'online'}, function(b){
                app.data.typing = 0;
                document.getElementById("sub-head-text").innerText = (b.response[0].online ? _('online') : _('offline'));
            });
        } else {
            app.data.lastTypeTime = a;
            if (!app.data.typing) document.getElementById("sub-head-text").innerHTML = ui.loading_svg(8,'#FFFFFF', 'padding-right: 5px')+_('is_typing');
            app.data.typing = 1;
            setTimeout(function(){if (app.data.lastTypeTime + 5 <= Math.round(Date.now() / 1000)) {im.showTypeStatus(false)}}, 5000);
        }
    },

    sendAttachment: function() {
        let attach = document.getElementById("attach-text-area");
        if (attach.value == '' || attach.value.match(/^ +$/)) {
            snack.show(_('u_cant_send_image_without_text'));
            document.getElementById("attach-text-area").focus();
            return;
        }
        if (app.data.filesSend) {
            let theText = attach.value;
            im.flipAction(3);
            popup.hideAll();
            im.uploadToServer(function(){
                let snd = app.data.attNames.join(',');
            api('messages.send', {user_id: app.data.user_id, text: theText, photos:snd}, function() {
                    im.flipAction(2);
                    document.getElementById("messages-input").focus();
                });});
        }
    },
    uploadToServer: function(cb) {
        app.data.attNames = [];
        app.data.filesSend.forEach(function(b, c){
            api('messages.imageUpload', {file: b, peer_id: app.data.user_id}, function(d) {
                let fileName = d.attachment.name;
                app.data.attNames.push(fileName);
                if (cb && app.data.filesSend.length == app.data.attNames.length) {cb(app.data.attNames);}
            }, {errorFunc: function(){im.flipAction(2)}});
        });
    },

    edit: function(a) {
        let m = a.getAttribute('data-message-id');
        let message = document.querySelector('.message-text[data-message-id="'+m+'"] .msg-content-text');
        app.data.editing_text = message.innerText;
        message.contentEditable = "true";
        message.setAttribute("tabindex", 0);
        message.setAttribute("autocomplete", "off");
        message.setAttribute("autocorrect", "off");
        message.setAttribute("autocapitalize", "off");
        message.setAttribute("spellcheck", "off");
        a.classList.add("focus");
        message.onblur = function(a) {
            im.sendEdit(a.target);
        };

        let range = document.createRange();
        let sel = window.getSelection();
        range.selectNodeContents(message);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);

        message.focus();
    },
    sendEdit: function(l) {
        if (app.data.edit_block == 1) return;
        app.data.edit_block = 1;
        let e = l;
        let text = e.innerText;

        e.contentEditable = "false";
        e.removeAttribute("tabindex");
        e.removeAttribute("autocomplete");
        e.removeAttribute("autocorrect");
        e.removeAttribute("autocapitalize");
        e.removeAttribute("spellcheck");
        e.parentElement.classList.remove("focus");
        e.onblur = undefined;
        let id = e.parentElement.getAttribute('data-message-id');
        api('messages.edit', {id: id, text: text}, function(a){
            if(a.success) {
            snack.show(_('edited'));
            app.data.edit_block = 0;
        }},
        {errorFunc: function(){
            e.innerText = app.data.editing_text;
            app.data.edit_block = 0;
        }});
    }
}