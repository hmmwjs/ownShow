// 评论系统处理脚本

// 获取当前页面的名称
function getCurrentPageName() {
    const path = window.location.pathname;
    const pageName = path.split('/').pop().replace('.html', '');
    return pageName || 'home';
}

// 加载评论
async function loadComments() {
    try {
        const response = await fetch('../data/comments.json');
        if (!response.ok) {
            throw new Error('无法加载评论数据');
        }
        const data = await response.json();
        const pageName = getCurrentPageName();
        
        // 显示评论
        displayComments(data[pageName] || []);
        
        // 显示评论总数
        updateCommentCount(data[pageName] ? data[pageName].length : 0);
    } catch (error) {
        console.error('加载评论时出错:', error);
        document.getElementById('comments-list').innerHTML = '<p class="error">加载评论失败，请稍后再试。</p>';
    }
}

// 显示评论
function displayComments(comments) {
    const commentsContainer = document.getElementById('comments-list');
    commentsContainer.innerHTML = '';
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p class="no-comments">暂无评论，成为第一个评论的人吧！</p>';
        return;
    }
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        
        const header = document.createElement('div');
        header.className = 'comment-header';
        
        const author = document.createElement('span');
        author.className = 'comment-author';
        author.textContent = comment.author || '匿名用户';
        
        const date = document.createElement('span');
        date.className = 'comment-date';
        date.textContent = new Date(comment.date).toLocaleString('zh-CN');
        
        const rating = document.createElement('div');
        rating.className = 'comment-rating';
        rating.innerHTML = '★'.repeat(comment.rating) + '☆'.repeat(5 - comment.rating);
        
        const content = document.createElement('div');
        content.className = 'comment-content';
        content.textContent = comment.content;
        
        header.appendChild(author);
        header.appendChild(date);
        header.appendChild(rating);
        
        commentElement.appendChild(header);
        commentElement.appendChild(content);
        
        commentsContainer.appendChild(commentElement);
    });
}

// 更新评论数量
function updateCommentCount(count) {
    const commentCount = document.getElementById('comment-count');
    if (commentCount) {
        commentCount.textContent = count;
    }
}

// 提交评论
async function submitComment(event) {
    event.preventDefault();
    
    const form = document.getElementById('comment-form');
    const nameInput = document.getElementById('comment-name');
    const contentInput = document.getElementById('comment-content');
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    
    if (!contentInput.value.trim()) {
        alert('评论内容不能为空');
        return;
    }
    
    if (!ratingInput) {
        alert('请选择评分');
        return;
    }
    
    // 禁用提交按钮
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = '提交中...';
    
    // 获取表单数据
    const newComment = {
        author: nameInput.value.trim() || '匿名用户',
        content: contentInput.value.trim(),
        rating: parseInt(ratingInput.value),
        date: new Date().toISOString()
    };
    
    try {
        // 使用API保存评论
        const response = await fetch('../api/save_comment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pageName: getCurrentPageName(),
                comment: newComment
            }),
        });
        
        if (!response.ok) {
            throw new Error('保存评论失败');
        }
        
        const result = await response.json();
        
        // 重新加载评论
        await loadComments();
        
        // 重置表单
        form.reset();
        
        // 显示成功消息
        alert('评论提交成功！');
    } catch (error) {
        console.error('提交评论时出错:', error);
        alert('提交评论失败：' + error.message);
    } finally {
        // 恢复提交按钮
        submitButton.disabled = false;
        submitButton.textContent = '提交评论';
    }
}

// 页面加载完成后初始化评论系统
document.addEventListener('DOMContentLoaded', function() {
    // 加载评论
    loadComments();
    
    // 添加表单提交事件监听
    const form = document.getElementById('comment-form');
    if (form) {
        form.addEventListener('submit', submitComment);
    }
    
    // 如果服务器不支持PHP，提供客户端模拟保存
    if (window.location.protocol === 'file:') {
        console.warn('在本地文件系统运行，将使用localStorage模拟评论保存');
        
        // 重写提交函数
        window.submitComment = async function(event) {
            event.preventDefault();
            
            const form = document.getElementById('comment-form');
            const nameInput = document.getElementById('comment-name');
            const contentInput = document.getElementById('comment-content');
            const ratingInput = document.querySelector('input[name="rating"]:checked');
            
            if (!contentInput.value.trim()) {
                alert('评论内容不能为空');
                return;
            }
            
            if (!ratingInput) {
                alert('请选择评分');
                return;
            }
            
            // 获取表单数据
            const newComment = {
                author: nameInput.value.trim() || '匿名用户',
                content: contentInput.value.trim(),
                rating: parseInt(ratingInput.value),
                date: new Date().toISOString()
            };
            
            try {
                // 从localStorage获取现有评论
                const pageName = getCurrentPageName();
                let comments = JSON.parse(localStorage.getItem('pageComments') || '{}');
                
                if (!comments[pageName]) {
                    comments[pageName] = [];
                }
                
                // 添加新评论
                comments[pageName].unshift(newComment);
                
                // 保存回localStorage
                localStorage.setItem('pageComments', JSON.stringify(comments));
                
                // 更新显示
                displayComments(comments[pageName]);
                updateCommentCount(comments[pageName].length);
                
                // 重置表单
                form.reset();
                
                alert('评论提交成功！（已保存到本地存储）');
            } catch (error) {
                console.error('保存评论到localStorage时出错:', error);
                alert('提交评论失败，请稍后再试');
            }
        };
        
        // 重写加载函数
        window.loadComments = function() {
            const pageName = getCurrentPageName();
            const comments = JSON.parse(localStorage.getItem('pageComments') || '{}');
            
            displayComments(comments[pageName] || []);
            updateCommentCount(comments[pageName] ? comments[pageName].length : 0);
        };
        
        // 重新绑定事件
        if (form) {
            form.removeEventListener('submit', submitComment);
            form.addEventListener('submit', window.submitComment);
        }
        
        // 重新加载评论
        window.loadComments();
    }
}); 