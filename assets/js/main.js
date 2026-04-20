// 苹果风格轻量交互脚本

(function() {
    'use strict';

    // 导航栏当前页面高亮 (active类已在HTML中静态指定，此处用于平滑滚动等增强)
    
    // 卡片交错淡入动画 (Intersection Observer)
    const cards = document.querySelectorAll('.card, .feature-item, .comparison-card');
    
    if (cards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // 平滑滚动 (点击导航链接时非跳转)
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === "#" || href === "") return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 视频懒加载 (对于iframe，保留原始src，由浏览器自行处理)
    // 无额外操作

    // 模型加载状态提示 (model-viewer 已有内置)
    const modelViewer = document.querySelector('model-viewer');
    if (modelViewer) {
        modelViewer.addEventListener('load', () => {
            console.log('3D模型加载完成');
        });
        modelViewer.addEventListener('error', () => {
            console.warn('3D模型加载失败，请检查路径');
        });
    }

    // 添加页面加载完成后的细微效果
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

})();