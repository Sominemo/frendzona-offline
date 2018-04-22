var player = {
    track: {

    },

    playlist: {
        update: function(){
            player.app.data.up_count = 0;
            player.app.data_cache.ch = 0;
            player.app.data_cache.offset = 1;
            api('audio.getList', {}, function(a){
                player.app.data.up_count = a.count;
                player.app.data.playlist = a.playlist;
                player.app.data_cache.ch = player.app.data_cache.ch + 10; 
                player.playlist.loadMore();
            });
        },
        loadMore: function() {
            if (player.app.data_cache.ch < player.app.data.up_count) {
                player.app.data_cache.offset++;
                api('audio.getList', {offset: player.app.data_cache.offset}, function(b){
                player.app.data.playlist = player.app.data.playlist.concat(b.playlist);
                player.app.data_cache.ch = player.app.data_cache.ch + 10; 
                if (player.app.data_cache.ch < player.app.data.up_count) player.playlist.loadMore();
            });
        }
        },

        show: function() {
            player.ui.element.playlistContent.innerHTML += '<div class="section">Music</div>';
            player.ui.element.playlistContents = document.createElement("div");
            player.ui.element.playlistContents.classList.add("contents");
            player.app.data.playlist.forEach(function(a){player.ui.element.playlistContents.innerHTML += player.ui.playlistTrack(a)});
            player.ui.element.playlistContent.appendChild(player.ui.element.playlistContents);
            player.ui.element.playlistContent.style.display = "block";
        }
    },

    smartActions: {

    },

    ui: {
        element: {},

        buildInterface: function() {
            // Player Container
            player.ui.element.container = document.createElement("div");
            player.ui.element.container.id = "playerContainer";

            // Player Box
            player.ui.element.playerBox = document.createElement("div");
            player.ui.element.playerBox.id = "playerBox";
            player.ui.element.playerBox.classList.add("player-box-hidden");


            // BUTTONS

            // Info Button
            player.ui.element.infoButton = document.createElement("icon");
            player.ui.element.infoButton.classList.add("player-button");
            player.ui.element.infoButton.id = "playerInfoButton";
            player.ui.element.infoButton.innerText = "info_outline";
            player.ui.element.playerBox.appendChild(player.ui.element.infoButton);

            // Voice Button
            player.ui.element.voiceButton = document.createElement("icon");
            player.ui.element.voiceButton.classList.add("player-button");
            player.ui.element.voiceButton.id = "playerVoiceButton";
            player.ui.element.voiceButton.innerText = player.ui.getVolumeIcon(player.app.getVolume());
            player.ui.element.playerBox.appendChild(player.ui.element.voiceButton);

            // Track change buttons
            player.ui.element.backButton = document.createElement("icon");
            player.ui.element.backButton.classList.add("player-button");
            player.ui.element.backButton.id = "playerBackButton";
            player.ui.element.backButton.innerText = "skip_previous";
            player.ui.element.playerBox.appendChild(player.ui.element.backButton);

            // Play Button
            player.ui.element.playButton = document.createElement("icon");
            player.ui.element.playButton.classList.add("player-button");
            player.ui.element.playButton.id = "playerPlayButton";
            player.ui.element.playButton.innerText = "play_arrow";
            player.ui.element.playerBox.appendChild(player.ui.element.playButton);

            // Track change buttons
            player.ui.element.forwardButton = document.createElement("icon");
            player.ui.element.forwardButton.classList.add("player-button");
            player.ui.element.forwardButton.id = "playerForwardButton";
            player.ui.element.forwardButton.innerText = "skip_next";
            player.ui.element.playerBox.appendChild(player.ui.element.forwardButton);

            // Add Button
            player.ui.element.addButton = document.createElement("icon");
            player.ui.element.addButton.classList.add("player-button");
            player.ui.element.addButton.id = "playerAddButton";
            player.ui.element.addButton.innerText = "add";
            player.ui.element.playerBox.appendChild(player.ui.element.addButton);

            // Playlist Button
            player.ui.element.playlistButton = document.createElement("icon");
            player.ui.element.playlistButton.classList.add("player-button");
            player.ui.element.playlistButton.id = "playerPlaylistButton";
            player.ui.element.playlistButton.innerText = "queue_music";
            player.ui.element.playlistButton.onclick = player.playlist.show;
            player.ui.element.playerBox.appendChild(player.ui.element.playlistButton);

            // BUTTONS


            // Track range
            player.ui.element.trackRange = document.createElement("div");
            player.ui.element.trackRange.id = "playerTrackRange";
            player.ui.element.trackRangeBall = document.createElement("div");
            player.ui.element.trackRangeBall.id = "playerTrackRangeBall";
            player.ui.element.trackRangeProgress = document.createElement("div");
            player.ui.element.trackRangeProgress.id = "playerTrackRangeProgress";
            player.ui.element.trackRange.appendChild(player.ui.element.trackRangeBall);
            player.ui.element.trackRange.appendChild(player.ui.element.trackRangeProgress);
            player.ui.element.playerBox.appendChild(player.ui.element.trackRange);

            // Title


            // DETAILS

            // DETAILS

            // Playlist
            player.ui.element.playlistContent = document.createElement("div");
            player.ui.element.playlistContent.id = "playlistContent";

            player.ui.element.buttonsContainer = document.createElement("div");
            player.ui.element.buttonsContainer.id = "buttonsContainer";

            player.ui.element.buttonsContainer.appendChild(player.ui.element.infoButton);
            player.ui.element.buttonsContainer.appendChild(player.ui.element.voiceButton);
            player.ui.element.buttonsContainer.appendChild(player.ui.element.backButton);
            player.ui.element.buttonsContainer.appendChild(player.ui.element.playButton);
            player.ui.element.buttonsContainer.appendChild(player.ui.element.forwardButton);
            player.ui.element.buttonsContainer.appendChild(player.ui.element.addButton);
            player.ui.element.buttonsContainer.appendChild(player.ui.element.playlistButton);
            player.ui.element.playerBox.appendChild(player.ui.element.trackRange);
            player.ui.element.playerBox.appendChild(player.ui.element.buttonsContainer);
            player.ui.element.container.appendChild(player.ui.element.playerBox);
            player.ui.element.container.appendChild(player.ui.element.playlistContent);
            document.body.appendChild(player.ui.element.container);
        },
        getVolumeIcon: function(a) {
                 if (a >= 50) return "volume_up";
            else if (a >= 20) return "volume_down";
            else if (a  >  0) return "volume_mute";
            else return "volume_off";
        },

        moveProgress: function(a) {
            player.ui.element.trackRangeBall.style.left = a+"%";
            player.ui.element.trackRangeProgress.style.width = a+"%";
        },

        playlistTrack: function(a) {
            return '<div class="playlist-track"><b>'+a.artist+'</b> - '+a.title+'</div>';
        }
    },

    app: {
        build: function() {
            player.ui.buildInterface();
            player.playlist.update();
        },

        getVolume: function() {
            return 95;
        },

        settings: {},
        data: {},
        data_cache: {}
    }
}

