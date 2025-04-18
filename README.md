# 个人研究网站

这是一个使用GitHub Pages托管的个人研究网站，主要展示自动驾驶和行为经济学领域的研究内容。

## 网站特点

- 响应式设计，适配各种设备
- 现代简洁的UI设计
- 分类展示不同研究领域的内容
- 个人简介和联系方式

## 网站结构

- 首页：概述和主要研究领域导航
- 自动驾驶页面：展示自动驾驶技术研究内容
- 行为经济学页面：展示行为经济学研究内容
- 关于我：个人背景、研究兴趣和联系方式

## 技术栈

- HTML5
- CSS3（自定义变量、Flexbox、Grid布局）
- JavaScript（原生JS，无框架）
- Font Awesome图标
- 响应式设计

## 如何部署到GitHub Pages

1. 在GitHub上创建一个新仓库，命名为`username.github.io`（用你的GitHub用户名替换`username`）
2. 将此项目代码克隆到本地：
   ```
   git clone https://github.com/username/username.github.io.git
   ```
3. 将所有文件复制到克隆的仓库文件夹中
4. 提交代码并推送到GitHub：
   ```
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```
5. 等待几分钟后，你的网站将在`https://username.github.io`上线

或者，你也可以在现有仓库中启用GitHub Pages：

1. 在仓库的"Settings"选项卡中
2. 滚动到"GitHub Pages"部分
3. 在"Source"下拉菜单中选择`main`分支
4. 点击"Save"按钮
5. 你的网站将在相应的URL上可用

## 自定义内容

要自定义网站内容，请编辑以下文件：

- `index.html`：首页内容
- `pages/autonomous-driving.html`：自动驾驶页面内容
- `pages/behavioral-economics.html`：行为经济学页面内容
- `pages/about.html`：关于我页面内容
- `css/style.css`：全局样式
- `js/main.js`：交互逻辑

## 许可证

MIT许可证 - 详情请参阅LICENSE文件 