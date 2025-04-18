// 从配置文件加载网站信息
async function loadSiteConfig() {
    try {
        // 添加加载中的样式
        const loadingElements = [
            document.querySelector('header h1'),
            document.querySelector('.hero h2'),
            document.querySelector('.hero p'),
            document.querySelector('footer p')
        ];
        loadingElements.forEach(el => {
            if (el) el.classList.add('loading');
        });
        
        // 使用相对路径加载配置文件
        const response = await fetch('./config.json');
        if (!response.ok) {
            throw new Error('无法加载配置文件');
        }
        const config = await response.json();
        
        // 更新网站标题
        document.title = config.siteTitle;
        
        // 更新头部标题
        const headerTitle = document.querySelector('header h1');
        if (headerTitle) {
            headerTitle.textContent = config.headerTitle;
            headerTitle.classList.remove('loading');
        }
        
        // 更新hero区域
        const heroTitle = document.querySelector('.hero h2');
        const heroDesc = document.querySelector('.hero p');
        if (heroTitle) {
            heroTitle.textContent = config.heroTitle;
            heroTitle.classList.remove('loading');
        }
        if (heroDesc) {
            heroDesc.textContent = config.heroDescription;
            heroDesc.classList.remove('loading');
        }
        
        // 更新页脚信息
        const footerText = document.querySelector('footer p');
        if (footerText) {
            footerText.textContent = config.footerText;
            footerText.classList.remove('loading');
        }
        
        // 更新社交链接
        const socialLinks = document.querySelectorAll('.social a');
        if (socialLinks.length > 0 && config.socialLinks) {
            const socialPlatforms = ['github', 'linkedin', 'twitter'];
            socialLinks.forEach((link, index) => {
                if (index < socialPlatforms.length) {
                    const platform = socialPlatforms[index];
                    if (config.socialLinks[platform]) {
                        link.href = config.socialLinks[platform];
                    }
                }
            });
        }
    } catch (error) {
        console.error('加载配置文件时出错:', error);
        
        // 移除loading类，显示错误信息
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(el => {
            el.classList.remove('loading');
            el.textContent = '配置加载失败';
        });
    }
}

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 加载配置信息
    loadSiteConfig();
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 导航栏滚动效果
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 150) {
            // 向下滚动，隐藏导航栏
            header.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动，显示导航栏
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // 为导航菜单项添加活动状态
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        
        if ((currentPage === '' && linkPage === 'index.html') || 
            (currentPage && linkPage === currentPage)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 添加滚动淡入效果
    const fadeElements = document.querySelectorAll('.card, .article-preview, .section');
    
    const fadeIn = function() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('scroll', fadeIn);
    fadeIn(); // 初始检查
});

// 添加CSS类，用于控制淡入效果
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .card, .article-preview, .section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .card.visible, .article-preview.visible, .section.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}); 