(function() {
    // 图片映射表：data-image 属性值 → 实际图片路径
    const imageMap = {
        'overall': 'assets/images/hardware-overall.jpg',
        'rail': 'assets/images/hardware-rail.jpg',
        'circuit': 'assets/images/hardware-circuit.jpg',
        'servo': 'assets/images/hardware-servo.jpg'
    };
    
    // 获取右侧预览图片元素
    let previewImg = document.getElementById('previewImage');
    const items = document.querySelectorAll('.spec-item');
    
    // 预加载所有图片，提升切换流畅度
    Object.values(imageMap).forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    /**
     * 切换右侧大图（带淡入淡出效果）
     * @param {string} imageKey - 图片键名，对应 imageMap 中的 key
     */
    function switchImage(imageKey) {
        const targetSrc = imageMap[imageKey];
        if (!targetSrc) return;
        
        // 创建新图片元素
        const newImg = new Image();
        newImg.src = targetSrc;
        newImg.alt = previewImg ? previewImg.alt : '';
        newImg.className = 'preview-image';
        newImg.style.opacity = '0';
        
        newImg.onload = () => {
            const container = previewImg.parentNode;
            container.appendChild(newImg);
            
            // 淡入新图片
            requestAnimationFrame(() => {
                newImg.style.transition = 'opacity 0.3s ease';
                newImg.style.opacity = '1';
            });
            
            // 淡出并移除旧图片
            if (previewImg && previewImg !== newImg) {
                previewImg.style.transition = 'opacity 0.2s ease';
                previewImg.style.opacity = '0';
                setTimeout(() => {
                    if (previewImg.parentNode === container) {
                        container.removeChild(previewImg);
                    }
                }, 200);
            }
            
            // 更新全局预览图片引用
            if (document.getElementById('previewImage')) {
                document.getElementById('previewImage').removeAttribute('id');
            }
            newImg.id = 'previewImage';
            previewImg = newImg;
        };
    }
    
    /**
     * 更新所有选项的图标符号（+ 或 −）
     */
    function updateIcons() {
        items.forEach(item => {
            const icon = item.querySelector('.icon-circle');
            if (icon) {
                icon.textContent = item.classList.contains('expanded') ? '−' : '+';
            }
        });
    }
    
    /**
     * 收起所有展开的项（除了当前项）
     * @param {HTMLElement} currentItem - 当前点击的项，不会被收起
     */
    function collapseOthers(currentItem) {
        items.forEach(item => {
            if (item !== currentItem && item.classList.contains('expanded')) {
                item.classList.remove('expanded');
            }
        });
    }
    
    // 为每个选项绑定点击事件
    items.forEach(item => {
        const trigger = item.querySelector('.spec-trigger');
        const imageKey = item.dataset.image;
        
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const isExpanded = item.classList.contains('expanded');
            
            // 先收起其他展开的项（不会造成卡顿，因为 CSS 过渡正常执行）
            collapseOthers(item);
            
            // 切换当前项的展开/收起状态
            if (!isExpanded) {
                item.classList.add('expanded');
                // 切换右侧图片
                if (imageKey) {
                    switchImage(imageKey);
                }
            } else {
                item.classList.remove('expanded');
                // 如果收起当前项，图片保持不变（或可切换为默认图，此处保持最后显示的图片）
            }
            
            // 更新所有图标符号
            updateIcons();
        });
    });
    
    // 初始化：默认展开第一项，并显示对应图片
    const firstItem = document.querySelector('.spec-item');
    if (firstItem) {
        // 确保初始状态正确（移除可能残留的 expanded 类）
        items.forEach(item => item.classList.remove('expanded'));
        firstItem.classList.add('expanded');
        updateIcons();
        const firstImageKey = firstItem.dataset.image;
        if (firstImageKey) {
            switchImage(firstImageKey);
        }
    }
})();