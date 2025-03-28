export function setupCarousel() {
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const nextButton = document.querySelector('.next-button');
  const prevButton = document.querySelector('.prev-button');
  const indicators = Array.from(document.querySelectorAll('.indicator'));
  const container = document.querySelector('.carousel-container');
  
  let currentIndex = 0;
  let isTransitioning = false;
  
  // 初始化轮播图
  function initCarousel() {
    // 设置初始样式 - 确保轮播能正确显示
    slides.forEach((slide, index) => {
      slide.dataset.index = index;
      slide.style.opacity = index === 0 ? '1' : '0.5';
      slide.style.transform = index === 0 ? 'scale(1)' : 'scale(0.9)';
    });
    
    // 初始定位
    updateCarouselPosition();
    
    // 添加事件监听器
    nextButton.addEventListener('click', () => {
      if (!isTransitioning) moveToSlide(currentIndex + 1);
    });
    
    prevButton.addEventListener('click', () => {
      if (!isTransitioning) moveToSlide(currentIndex - 1);
    });
    
    // 指示器点击事件
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        if (!isTransitioning) moveToSlide(index);
      });
    });
    
    // 键盘导航
    document.addEventListener('keydown', handleKeyDown);
    
    // 添加过渡结束事件监听器
    track.addEventListener('transitionend', () => {
      isTransitioning = false;
      
      // 更新幻灯片样式
      slides.forEach((slide, index) => {
        if (index === currentIndex) {
          slide.style.opacity = '1';
          slide.style.transform = 'scale(1)';
        } else {
          slide.style.opacity = '0.5';
          slide.style.transform = 'scale(0.9)';
        }
      });
    });
    
    // 手势支持
    setupTouchEvents();
    
    // 添加窗口大小变化事件监听
    window.addEventListener('resize', () => {
      updateCarouselPosition();
    });
    
    // 自动轮播
    startAutoSlide();
  }
  
  function updateCarouselPosition() {
    const slideWidth = getSlideWidth();
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    
    // 更新指示器状态
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }
  
  function getSlideWidth() {
    // 获取最新的宽度，以处理窗口大小变化
    return container.clientWidth;
  }
  
  function moveToSlide(index) {
    // 避免快速点击
    if (isTransitioning) return;
    
    isTransitioning = true;
    
    // 循环滚动
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }
    
    currentIndex = index;
    updateCarouselPosition();
  }
  
  function handleKeyDown(e) {
    if (e.key === 'ArrowRight') {
      if (!isTransitioning) moveToSlide(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      if (!isTransitioning) moveToSlide(currentIndex - 1);
    }
  }
  
  function setupTouchEvents() {
    let startX, endX;
    const minSwipeDistance = 50;
    
    container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
      if (!startX) return;
      
      endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          // 向左滑动，显示下一张
          if (!isTransitioning) moveToSlide(currentIndex + 1);
        } else {
          // 向右滑动，显示上一张
          if (!isTransitioning) moveToSlide(currentIndex - 1);
        }
      }
      
      startX = null;
    }, { passive: true });
  }
  
  function startAutoSlide() {
    const autoSlideInterval = 5000; // 5秒切换一次
    let autoSlideTimer;
    
    function resetAutoSlideTimer() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
      }
      
      autoSlideTimer = setInterval(() => {
        moveToSlide(currentIndex + 1);
      }, autoSlideInterval);
    }
    
    // 鼠标悬停时暂停自动轮播
    container.addEventListener('mouseenter', () => {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
    });
    
    container.addEventListener('mouseleave', resetAutoSlideTimer);
    
    // 用户交互后重置计时器
    [nextButton, prevButton, ...indicators].forEach(el => {
      el.addEventListener('click', resetAutoSlideTimer);
    });
    
    // 开始自动轮播
    resetAutoSlideTimer();
  }
  
  // 初始化轮播图
  initCarousel();
}
