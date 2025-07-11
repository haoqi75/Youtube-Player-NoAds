// YouTube 播放器变量
let player;
let isMuted = false;
let lastVolume = 50;

// 初始化播放器
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            'autoplay': 0,
            'controls': 1,
            'disablekb': 0,
            'enablejsapi': 1,
            'fs': 1,
            'rel': 0, // 不显示相关视频
            'modestbranding': 1, // 减少 YouTube logo
            'iv_load_policy': 3 // 不显示注释
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 播放器准备就绪
function onPlayerReady(event) {
    console.log('播放器准备就绪');
    event.target.setVolume(50);
    
    // 添加事件监听器
    document.getElementById('playBtn').addEventListener('click', playVideo);
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
    document.getElementById('muteBtn').addEventListener('click', toggleMute);
    document.getElementById('volumeSlider').addEventListener('input', changeVolume);
}

// 播放器状态变化
function onPlayerStateChange(event) {
    console.log('播放器状态变化:', event.data);
}

// 播放视频
function playVideo() {
    const videoInput = document.getElementById('videoUrl').value.trim();
    
    if (!videoInput) {
        alert('请输入 YouTube 视频链接或ID');
        return;
    }
    
    let videoId = extractVideoId(videoInput);
    
    if (!videoId) {
        alert('无效的 YouTube 视频链接或ID');
        return;
    }
    
    player.loadVideoById(videoId);
}

// 从URL中提取视频ID
function extractVideoId(url) {
    // 检查是否是视频ID格式
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }
    
    // 检查各种YouTube URL格式
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
        return match[2];
    }
    
    return null;
}

// 切换全屏
function toggleFullscreen() {
    const playerElement = document.getElementById('player');
    
    if (!document.fullscreenElement) {
        if (playerElement.requestFullscreen) {
            playerElement.requestFullscreen();
        } else if (playerElement.webkitRequestFullscreen) {
            playerElement.webkitRequestFullscreen();
        } else if (playerElement.msRequestFullscreen) {
            playerElement.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// 切换静音
function toggleMute() {
    if (isMuted) {
        player.unMute();
        player.setVolume(lastVolume);
        document.getElementById('volumeSlider').value = lastVolume;
        document.getElementById('muteBtn').textContent = '静音';
    } else {
        lastVolume = player.getVolume();
        player.mute();
        document.getElementById('volumeSlider').value = 0;
        document.getElementById('muteBtn').textContent = '取消静音';
    }
    
    isMuted = !isMuted;
}

// 改变音量
function changeVolume() {
    const volume = document.getElementById('volumeSlider').value;
    player.setVolume(volume);
    
    if (volume == 0) {
        player.mute();
        isMuted = true;
        document.getElementById('muteBtn').textContent = '取消静音';
    } else {
        if (isMuted) {
            player.unMute();
            isMuted = false;
            document.getElementById('muteBtn').textContent = '静音';
        }
        lastVolume = volume;
    }
}
