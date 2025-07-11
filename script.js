// 播放器实例
let player;
let isMuted = false;
let lastVolume = 50;

// DOM 元素
const videoInput = document.getElementById('videoUrl');
const playBtn = document.getElementById('playBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const videoInfo = document.getElementById('videoInfo');
const playerContainer = document.getElementById('player-container');
const placeholder = document.querySelector('.placeholder');

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
            'rel': 0,
            'modestbranding': 1,
            'iv_load_policy': 3,
            'color': 'white',
            'playsinline': 1
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
    event.target.setVolume(lastVolume);
    
    // 设置初始音量滑块值
    volumeSlider.value = lastVolume;
    
    // 添加事件监听器
    playBtn.addEventListener('click', playVideo);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    muteBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', changeVolume);
    
    // 添加键盘快捷键
    document.addEventListener('keydown', handleKeyPress);
}

// 播放器状态变化
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        // 视频开始播放时隐藏占位图
        placeholder.style.display = 'none';
        
        // 获取视频信息
        updateVideoInfo();
    }
}

// 更新视频信息显示
function updateVideoInfo() {
    try {
        const videoTitle = player.getVideoData().title;
        videoInfo.innerHTML = `<i class="fas fa-info-circle"></i> 正在播放: ${videoTitle}`;
    } catch (e) {
        console.error('获取视频信息失败:', e);
    }
}

// 播放视频
function playVideo() {
    const videoInputValue = videoInput.value.trim();
    
    if (!videoInputValue) {
        showError('请输入 YouTube 视频链接或ID');
        return;
    }
    
    const videoId = extractVideoId(videoInputValue);
    
    if (!videoId) {
        showError('无效的 YouTube 视频链接或ID');
        return;
    }
    
    // 显示加载状态
    videoInfo.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载视频中...';
    placeholder.style.display = 'flex';
    
    player.loadVideoById(videoId);
}

// 从URL提取视频ID
function extractVideoId(url) {
    // 检查是否是视频ID格式
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }
    
    // 检查各种YouTube URL格式
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
}

// 切换全屏
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        playerContainer.requestFullscreen?.() ||
        playerContainer.webkitRequestFullscreen?.() ||
        playerContainer.msRequestFullscreen?.();
    } else {
        document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.msExitFullscreen?.();
    }
}

// 切换静音
function toggleMute() {
    if (isMuted) {
        player.unMute();
        player.setVolume(lastVolume);
        volumeSlider.value = lastVolume;
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        lastVolume = player.getVolume();
        player.mute();
        volumeSlider.value = 0;
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
    
    isMuted = !isMuted;
}

// 改变音量
function changeVolume() {
    const volume = volumeSlider.value;
    player.setVolume(volume);
    
    if (volume == 0) {
        player.mute();
        isMuted = true;
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        if (isMuted) {
            player.unMute();
            isMuted = false;
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        lastVolume = volume;
    }
}

// 键盘快捷键
function handleKeyPress(e) {
    switch (e.key) {
        case ' ':
            // 空格键切换播放/暂停
            if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
            break;
        case 'f':
        case 'F':
            toggleFullscreen();
            break;
        case 'ArrowUp':
            // 上箭头增加音量
            const currentVol = player.getVolume();
            const newVol = Math.min(currentVol + 10, 100);
            player.setVolume(newVol);
            volumeSlider.value = newVol;
            break;
        case 'ArrowDown':
            // 下箭头减小音量
            const currentVol2 = player.getVolume();
            const newVol2 = Math.max(currentVol2 - 10, 0);
            player.setVolume(newVol2);
            volumeSlider.value = newVol2;
            break;
    }
}

// 显示错误信息
function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorEl.style.position = 'fixed';
    errorEl.style.top = '20px';
    errorEl.style.right = '20px';
    errorEl.style.padding = '15px 20px';
    errorEl.style.background = 'var(--primary)';
    errorEl.style.color = 'white';
    errorEl.style.borderRadius = '8px';
    errorEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    errorEl.style.zIndex = '1000';
    errorEl.style.animation = 'fadeIn 0.3s ease';
    
    document.body.appendChild(errorEl);
    
    setTimeout(() => {
        errorEl.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => errorEl.remove(), 300);
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);
