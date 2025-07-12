// 播放器通信变量
let playerIframe = document.getElementById('player-iframe');
let playerPlaceholder = document.getElementById('playerPlaceholder');
let videoInput = document.getElementById('videoUrl');
let playBtn = document.getElementById('playBtn');
let videoInfoContent = document.getElementById('videoInfoContent');

// 初始化播放器通信
function initPlayer() {
    // 监听来自播放器的消息
    window.addEventListener('message', function(event) {
        if (event.source !== playerIframe.contentWindow) return;
        
        const data = event.data;
        switch(data.type) {
            case 'ready':
                console.log('播放器准备就绪');
                break;
            case 'videoInfo':
                updateVideoInfo(data.payload);
                break;
            case 'error':
                showError(data.message);
                break;
        }
    });
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
    videoInfoContent.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> 加载视频中...</p>';
    
    // 发送播放指令到iframe
    playerIframe.contentWindow.postMessage({
        type: 'loadVideo',
        videoId: videoId
    }, '*');
    
    // 激活iframe显示
    setTimeout(() => {
        playerIframe.classList.add('active');
        playerPlaceholder.style.display = 'none';
    }, 500);
}

// 从URL提取视频ID
function extractVideoId(url) {
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
}

// 更新视频信息
function updateVideoInfo(info) {
    let html = `
        <p><strong>标题:</strong> ${info.title}</p>
        <p><strong>作者:</strong> ${info.author}</p>
        <p><strong>时长:</strong> ${formatTime(info.duration)}</p>
    `;
    videoInfoContent.innerHTML = html;
}

// 格式化时间
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 显示错误
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

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initPlayer();
    
    // 添加事件监听
    playBtn.addEventListener('click', playVideo);
    videoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') playVideo();
    });
});
