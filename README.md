# 🎥 PureTube - 优雅的无广告 YouTube 播放器  

![PureTube 界面展示](./screenshot.jpg)  
*(实际使用时请替换为真实截图)*  

## ✨ 特性亮点  

- 🌈 **极简美学设计** - 精心调校的 UI 与动画效果  
- 🚫 **广告拦截** - 通过智能参数屏蔽大部分广告  
- 🎛️ **专业控制台** - 音量、画质、播放速度一键调节  
- 🌍 **多平台适配** - 从手机到 4K 显示器完美呈现  
- ⚡ **闪电加载** - 优化过的代码确保流畅体验  

## 🛠️ 安装指南  

### 本地使用  
```bash
git clone https://github.com/yourusername/puretube.git
cd puretube
open index.html  # 或在文件管理器中双击
```

### 网页部署  
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/puretube)  
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/puretube)  

## 🎮 使用说明  

1. **粘贴链接** - 输入 YouTube URL 或视频 ID  
   ```
   支持格式:
   - https://youtu.be/dQw4w9WgXcQ
   - https://www.youtube.com/watch?v=dQw4w9WgXcQ
   - 直接输入 dQw4w9WgXcQ
   ```

2. **高级控制**  
   - `空格键` 播放/暂停  
   - `F` 进入全屏  
   - `↑↓箭头` 调节音量  
   - `←→箭头` 前进/后退 5秒  

3. **画质选择**  
   右键点击播放器可选择分辨率  

## 🌈 主题定制  

在 `styles.css` 中修改 CSS 变量即可换肤：  
```css
:root {
  --primary-color: #ff4d4d;  /* 主色调 */
  --bg-color: #121212;       /* 背景色 */
  --text-color: #e0e0e0;    /* 文字色 */
  --control-bg: rgba(30,30,30,0.7); /* 控制栏背景 */
}
```

## 📊 技术架构  

```mermaid
graph TD
    A[用户界面] --> B[YouTube IFrame API]
    B --> C[播放器控制]
    C --> D[广告屏蔽参数]
    D --> E[优化播放]
```

## 🚧 已知限制  

⚠️ 因 YouTube 政策限制：  
- 部分版权视频可能无法播放  
- 移动端全屏需要手势操作  
- 4K 画质需要高级账号  

## 🤝 参与贡献  

我们欢迎各种形式的贡献！  
1. 提交 Issue 报告问题  
2. Fork 项目并提交 PR  
3. 帮助改进文档  
4. 分享使用体验  

## 📜 开源协议  

MIT License | © 2023 PureTube Contributors  

---

<div align="center">
  <sub>用 ❤️ 制作 | 星星支持我们 ⭐</sub>
</div>

---
