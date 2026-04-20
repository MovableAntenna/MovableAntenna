/**
 * 全局交互脚本 main.js
 * 适用于所有页面：导航栏动态效果、卡片淡入、平滑滚动、模型监听等
 */

(function() {
    'use strict';

    // ---------- 导航栏滚动效果：滚动时加深背景 ----------
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // 检查导航栏是否使用了液态玻璃样式（通过背景色判断）
        const isGlassNav = window.getComputedStyle(navbar).backdropFilter !== 'none' || 
                          window.getComputedStyle(navbar).webkitBackdropFilter !== 'none';

        if (isGlassNav) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 20) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.65)';
                    navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.4)';
                    navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.05)';
                }
            });
        }
    }

    // ---------- 卡片交错误入动画 (Intersection Observer) ----------
    const animatedElements = document.querySelectorAll('.card, .feature-item, .comparison-card, .flow-node, .spec-item');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    // 可选：取消观察以节省性能
                    // observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1, 
            rootMargin: '0px 0px -20px 0px' 
        });

        animatedElements.forEach(el => {
            // 设置初始隐藏状态（如果尚未定义）
            const currentOpacity = window.getComputedStyle(el).opacity;
            const currentTransform = window.getComputedStyle(el).transform;
            // 避免覆盖已有内联样式，仅在未设置时添加
            if (currentOpacity === '1' && (currentTransform === 'none' || currentTransform === 'matrix(1, 0, 0, 1, 0, 0)')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
            observer.observe(el);
        });
    }

    // ---------- 平滑滚动：处理锚点链接 ----------
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ---------- model-viewer 加载状态监听（首页 3D 模型）----------
    const modelViewer = document.querySelector('model-viewer');
    if (modelViewer) {
        modelViewer.addEventListener('load', () => {
            console.log('✅ 3D 模型加载完成');
        });
        modelViewer.addEventListener('error', (error) => {
            console.warn('⚠️ 3D 模型加载失败:', error);
            // 可在此显示友好提示
        });
    }

    // ---------- 页面完全加载后的细微效果 ----------
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // 为图片添加渐进加载效果（可选）
        const images = document.querySelectorAll('img:not(.preview-image)');
        images.forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.4s ease';
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
            }
        });
    });

    // ---------- 辅助：处理滚动吸附时的导航栏遮挡（scroll-margin 已在 CSS 中定义）----------
    // 此部分无需额外代码，由 CSS scroll-margin-top 处理

})();