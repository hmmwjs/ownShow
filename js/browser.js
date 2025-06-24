document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const iframe = document.getElementById('browser-iframe');
    const urlInput = document.getElementById('url-input');
    const goButton = document.getElementById('go-button');
    const backButton = document.getElementById('back-button');
    const forwardButton = document.getElementById('forward-button');
    const refreshButton = document.getElementById('refresh-button');
    const homeButton = document.getElementById('home-button');
    const statusText = document.getElementById('status-text');
    const loading = document.getElementById('loading');

    // 设置默认主页 - 选择一些可以在iframe中加载的网站
    const homePage = 'https://bing.com/';
    let currentUrl = homePage;
    
    // 使用公共CORS代理
    const useProxy = true; // 设置为true启用代理
    // 可用的公共CORS代理列表
    const publicProxies = [
        'https://cors-anywhere.herokuapp.com/',  // 需要点击演示页面获取临时访问权限
        'https://api.allorigins.win/raw?url=',   // 另一个公共代理
        'https://corsproxy.io/?'                 // 另一个选择
    ];
    // 当前使用的代理索引
    let currentProxyIndex = 2; // 默认使用corsproxy.io

    // 初始化
    function init() {
        urlInput.value = homePage;
        loadUrl(homePage);
        updateButtons();
        displayProxyWarning();
    }

    // 显示代理警告
    function displayProxyWarning() {
        statusText.textContent = '注意：由于浏览器安全限制，某些网站可能无法正常显示。我们使用公共代理服务尝试解决此问题。';
    }

    // 创建代理URL
    function createProxyUrl(url) {
        if (useProxy) {
            // 确保URL格式正确
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            return `${publicProxies[currentProxyIndex]}${encodeURIComponent(url)}`;
        }
        return url;
    }

    // 切换到下一个代理
    function switchProxy() {
        currentProxyIndex = (currentProxyIndex + 1) % publicProxies.length;
        statusText.textContent = `已切换到代理: ${currentProxyIndex + 1}`;
        return currentProxyIndex;
    }

    // 加载URL
    function loadUrl(url) {
        // 如果是特殊的切换代理命令
        if (url === 'switch:proxy') {
            switchProxy();
            return;
        }

        // 确保URL格式正确
        if (!url.startsWith('http://') && !url.startsWith('https://') && 
            !url.startsWith('https://cors-anywhere') && 
            !url.startsWith('https://api.allorigins') &&
            !url.startsWith('https://corsproxy.io')) {
            url = 'https://' + url;
        }

        // 更新状态
        statusText.textContent = `正在加载: ${url}`;
        loading.classList.add('active');
        
        try {
            // 使用公共代理服务
            const iframeUrl = useProxy && !url.includes(publicProxies[currentProxyIndex]) ? 
                              createProxyUrl(url) : url;
            iframe.src = iframeUrl;
            currentUrl = url;
            urlInput.value = url;
        } catch (error) {
            statusText.textContent = `加载失败: ${error.message}`;
        }
    }

    // 更新按钮状态
    function updateButtons() {
        try {
            backButton.disabled = !iframe.contentWindow.history.length;
        } catch (error) {
            // 跨域访问限制，无法获取历史记录长度
            backButton.disabled = false;
        }
    }

    // 事件监听器
    goButton.addEventListener('click', () => {
        loadUrl(urlInput.value);
    });

    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadUrl(urlInput.value);
        }
    });

    backButton.addEventListener('click', () => {
        try {
            iframe.contentWindow.history.back();
        } catch (error) {
            // 如果无法直接访问iframe内容，则重新加载当前页面
            loadUrl(currentUrl);
        }
    });

    forwardButton.addEventListener('click', () => {
        try {
            iframe.contentWindow.history.forward();
        } catch (error) {
            // 如果无法直接访问iframe内容，则重新加载当前页面
            loadUrl(currentUrl);
        }
    });

    refreshButton.addEventListener('click', () => {
        try {
            iframe.contentWindow.location.reload();
        } catch (error) {
            // 如果无法直接访问iframe内容，则重新加载当前页面
            loadUrl(currentUrl);
        }
    });

    homeButton.addEventListener('click', () => {
        loadUrl(homePage);
    });

    // iframe加载完成事件
    iframe.addEventListener('load', () => {
        loading.classList.remove('active');
        
        try {
            // 尝试获取iframe URL
            const iframeUrl = iframe.contentWindow.location.href;
            // 从代理URL中提取原始URL
            let displayUrl = iframeUrl;
            
            for (let proxy of publicProxies) {
                if (iframeUrl.includes(proxy)) {
                    const encodedUrl = iframeUrl.split(proxy)[1];
                    displayUrl = decodeURIComponent(encodedUrl);
                    break;
                }
            }
            
            statusText.textContent = `已加载: ${displayUrl}`;
            urlInput.value = displayUrl;
            
            // 尝试访问iframe的内容（可能会因为跨域限制而失败）
            const title = iframe.contentDocument.title;
            document.title = `内嵌浏览器 - ${title}`;
        } catch (error) {
            // 跨域访问限制，无法获取标题
            document.title = '内嵌浏览器';
            statusText.textContent = `已加载: ${urlInput.value}`;
        }
        
        updateButtons();
    });

    // 处理错误
    iframe.addEventListener('error', () => {
        loading.classList.remove('active');
        statusText.textContent = '加载失败，请尝试切换代理（在地址栏输入 switch:proxy）';
    });

    // 初始化浏览器
    init();
}); 