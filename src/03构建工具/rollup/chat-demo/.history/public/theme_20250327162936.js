/**
 * 聊天应用主题切换功能
 */

document.addEventListener('DOMContentLoaded', () => {
    // 创建主题选择器
    createThemeSelector();
    
    // 加载保存的主题
    loadSavedTheme();
});

// 可用的主题列表
const themes = [
    { id: 'neumorphism', name: '新拟态' },
    { id: 'dark', name: '暗黑' },
    { id: 'candy', name: '粉色' },
    { id: 'minimal', name: '极简' },
    { id: 'tech', name: '科技蓝' },
    { id: 'retro', name: '复古' },
    { id: 'nature', name: '自然' },
    { id: 'cyberpunk', name: '赛博朋克' },
    { id: 'ocean', name: '海洋' },
    { id: 'accessible', name: '高对比度' }
];

/**
 * 创建主题选择器UI
 */
function createThemeSelector() {
    const themeSelector = document.createElement('div');
    themeSelector.className = 'theme-selector';
    
    const header = document.createElement('h3');
    header.textContent = '选择主题';
    themeSelector.appendChild(header);
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'theme-options';
    
    themes.forEach(theme => {
        const option = document.createElement('div');
        option.className = `theme-option ${theme.id}`;
        option.title = theme.name;
        option.dataset.theme = theme.id;
        option.addEventListener('click', () => setTheme(theme.id));
        optionsContainer.appendChild(option);
    });
    
    themeSelector.appendChild(optionsContainer);
    document.body.appendChild(themeSelector);
}

/**
 * 设置主题
 * @param {string} themeId - 主题ID
 */
function setTheme(themeId) {
    // 移除所有现有主题类
    themes.forEach(theme => {
        document.body.classList.remove(`theme-${theme.id}`);
    });
    
    // 添加选定的主题类
    document.body.classList.add(`theme-${themeId}`);
    
    // 更新活跃主题样式
    updateActiveTheme(themeId);
    
    // 保存主题选择到本地存储
    localStorage.setItem('chat-theme', themeId);
}

/**
 * 更新活跃主题样式
 * @param {string} activeThemeId - 活跃主题ID
 */
function updateActiveTheme(activeThemeId) {
    const options = document.querySelectorAll('.theme-option');
    options.forEach(option => {
        if (option.dataset.theme === activeThemeId) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

/**
 * 加载保存的主题
 */
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('chat-theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // 默认主题
        setTheme('neumorphism');
    }
}
