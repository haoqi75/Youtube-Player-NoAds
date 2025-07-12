class PureTubePlayer {
    constructor() {
        this.player = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.lastVolume = 50;
        this.currentQuality = 'auto';
        this.currentSpeed = 1;
        this.videoTitle = 'Select a video to play';
        
        this.initElements();
        this.initEventListeners();
        this.initYouTubePlayer();
    }
    
    initElements() {
        // Player elements
        this.playerContainer = document.getElementById('player-container');
        this.youtubePlayer = document.getElementById('youtube-player');
        
        // Controls
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.skipBackBtn = document.getElementById('skip-back-btn');
        this.skipForwardBtn = document.getElementById('skip-forward-btn');
        this.volumeBtn = document.getElementById('volume-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        this.progressBar = document.getElementById('progress-bar');
        this.currentTimeDisplay = document.getElementById('current-time');
        this.durationDisplay = document.getElementById('duration');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.videoTitleElement = document.getElementById('video-title');
        this.backBtn = document.getElementById('back-btn');
        
        // Settings menu
        this.settingsBtn = document.getElementById('settings-btn');
        this.settingsMenu = document.getElementById('settings-menu');
        this.closeSettingsBtn = document.getElementById('close-settings');
        this.playbackSpeedSelect = document.getElementById('playback-speed');
        this.qualityPresetSelect = document.getElementById('quality-preset');
    }
    
    initEventListeners() {
        // Play/pause
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Skip buttons
        this.skipBackBtn.addEventListener('click', () => this.skip(-10));
        this.skipForwardBtn.addEventListener('click', () => this.skip(10));
        
        // Volume controls
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // Progress bar
        this.progressBar.addEventListener('input', (e) => this.seekTo(e.target.value));
        
        // Fullscreen
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Settings menu
        this.settingsBtn.addEventListener('click', () => this.toggleSettingsMenu());
        this.closeSettingsBtn.addEventListener('click', () => this.toggleSettingsMenu(false));
        this.playbackSpeedSelect.addEventListener('change', (e) => this.setPlaybackSpeed(e.target.value));
        this.qualityPresetSelect.addEventListener('change', (e) => this.setQuality(e.target.value));
        
        // Back button
        this.backBtn.addEventListener('click', () => window.history.back());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Hide controls when mouse is idle
        this.setupIdleTimer();
    }
    
    initYouTubePlayer() {
        // This will be replaced by the YouTube API
        this.player = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'disablekb': 1,
                'enablejsapi': 1,
                'fs': 0,
                'rel': 0,
                'modestbranding': 1,
                'iv_load_policy': 3
            },
            events: {
                'onReady': (e) => this.onPlayerReady(e),
                'onStateChange': (e) => this.onPlayerStateChange(e)
            }
        });
    }
    
    onPlayerReady(event) {
    console.log('YouTube player ready');
    this.player = event.target;
    this.setVolume(this.lastVolume);
    
    // 通知父页面播放器已准备就绪
    this.postMessageToParent('playerReady', {});
    
    // 如果URL中有预加载的视频ID
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId');
    if (videoId) {
        this.loadVideo(videoId);
    }
    }
    
    onPlayerStateChange(event) {
        switch(event.data) {
            case YT.PlayerState.PLAYING:
                this.isPlaying = true;
                this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                this.updateVideoInfo();
                break;
            case YT.PlayerState.PAUSED:
                this.isPlaying = false;
                this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                break;
            case YT.PlayerState.ENDED:
                this.isPlaying = false;
                this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                break;
        }
    }
    
    togglePlayPause() {
        if (!this.player) return;
        
        if (this.isPlaying) {
            this.player.pauseVideo();
        } else {
            this.player.playVideo();
        }
    }
    
    skip(seconds) {
        if (!this.player) return;
        
        const currentTime = this.player.getCurrentTime();
        this.player.seekTo(currentTime + seconds, true);
    }
    
    toggleMute() {
        if (!this.player) return;
        
        if (this.isMuted) {
            this.player.unMute();
            this.player.setVolume(this.lastVolume);
            this.volumeSlider.value = this.lastVolume;
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            this.lastVolume = this.player.getVolume();
            this.player.mute();
            this.volumeSlider.value = 0;
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
        
        this.isMuted = !this.isMuted;
    }
    
    setVolume(volume) {
        if (!this.player) return;
        
        volume = parseInt(volume);
        
        if (volume === 0) {
            this.player.mute();
            this.isMuted = true;
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            if (this.isMuted) {
                this.player.unMute();
                this.isMuted = false;
                this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
            this.lastVolume = volume;
            this.player.setVolume(volume);
        }
        
        // Update volume icon based on level
        if (volume > 0) {
            if (volume < 30) {
                this.volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
            } else if (volume < 70) {
                this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                this.volumeBtn.innerHTML = '<i class="fas fa-volume-high"></i>';
            }
        }
    }
    
    seekTo(percent) {
        if (!this.player) return;
        
        const duration = this.player.getDuration();
        const newTime = (percent / 100) * duration;
        this.player.seekTo(newTime, true);
    }
    
    updateProgress() {
        if (!this.player || !this.isPlaying) return;
        
        const currentTime = this.player.getCurrentTime();
        const duration = this.player.getDuration();
        
        if (duration > 0) {
            const percent = (currentTime / duration) * 100;
            this.progressBar.value = percent;
            
            // Update time displays
            this.currentTimeDisplay.textContent = this.formatTime(currentTime);
            this.durationDisplay.textContent = this.formatTime(duration);
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.playerContainer.requestFullscreen?.() ||
            this.playerContainer.webkitRequestFullscreen?.() ||
            this.playerContainer.msRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() ||
            document.webkitExitFullscreen?.() ||
            document.msExitFullscreen?.();
        }
    }
    
    toggleSettingsMenu(show = null) {
        if (show === null) {
            show = !this.settingsMenu.classList.contains('active');
        }
        
        if (show) {
            this.settingsMenu.classList.add('active');
        } else {
            this.settingsMenu.classList.remove('active');
        }
    }
    
    setPlaybackSpeed(speed) {
        if (!this.player) return;
        
        speed = parseFloat(speed);
        this.player.setPlaybackRate(speed);
        this.currentSpeed = speed;
    }
    
    setQuality(quality) {
        // Note: YouTube API doesn't directly support quality changes
        // This would need to be implemented with player.loadVideoById with quality parameter
        this.currentQuality = quality;
        console.log('Quality set to:', quality);
    }
    
    updateVideoInfo() {
        try {
            const videoData = this.player.getVideoData();
            this.videoTitle = videoData.title;
            this.videoTitleElement.textContent = this.videoTitle;
        } catch (e) {
            console.error('Could not get video data:', e);
        }
    }
    
    handleKeyPress(e) {
        switch(e.key) {
            case ' ':
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                this.skip(-5);
                break;
            case 'ArrowRight':
                this.skip(5);
                break;
            case 'ArrowUp':
                this.setVolume(Math.min(this.lastVolume + 10, 100));
                break;
            case 'ArrowDown':
                this.setVolume(Math.max(this.lastVolume - 10, 0));
                break;
            case 'm':
            case 'M':
                this.toggleMute();
                break;
            case 'f':
            case 'F':
                this.toggleFullscreen();
                break;
        }
    }
    
    setupIdleTimer() {
        let idleTimer;
        const resetTimer = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                document.querySelector('.player-overlay').style.opacity = '0';
            }, 3000);
        };
        
        resetTimer();
        
        document.addEventListener('mousemove', () => {
            document.querySelector('.player-overlay').style.opacity = '1';
            resetTimer();
        });
    }
    postMessageToParent(type, payload) {
    if (window.parent) {
        window.parent.postMessage({
            type: type,
            payload: payload
        }, '*'); // 生产环境应替换为具体域名
    }
    }
}

// Initialize player when YouTube API is ready
function onYouTubeIframeAPIReady() {
    window.pureTubePlayer = new PureTubePlayer();
}
