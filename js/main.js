// 主页面 JavaScript 功能
class VocabularyApp {
    constructor() {
        this.vocabulary = [];
        this.currentWords = [];
        this.init();
    }

    async init() {
        try {
            await this.loadVocabulary();
            this.renderCards();
            this.bindEvents();
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('加载单词数据失败，请刷新页面重试。');
        }
    }

    // 加载词汇数据
    async loadVocabulary() {
        try {
            this.showLoading();
            
            // 尝试加载JSON文件
            try {
                const response = await fetch('./data/vocabulary.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                this.vocabulary = data.words || [];
                console.log('成功从JSON文件加载数据');
            } catch (fetchError) {
                console.warn('无法加载JSON文件，使用备用数据:', fetchError.message);
                
                // 使用备用数据
                if (window.fallbackVocabulary && window.fallbackVocabulary.words) {
                    this.vocabulary = window.fallbackVocabulary.words;
                    console.log('使用备用数据');
                } else {
                    throw new Error('备用数据也不可用');
                }
            }
            
            this.currentWords = [...this.vocabulary];
            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            throw error;
        }
    }

    // 渲染单词卡片
    renderCards(words = this.currentWords) {
        const grid = document.getElementById('wordGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        if (words.length === 0) {
            grid.innerHTML = '<div class="no-words">暂无单词数据</div>';
            return;
        }

        words.forEach((word, index) => {
            const card = this.createWordCard(word, index);
            grid.appendChild(card);
        });
    }

    // 创建单词卡片
    createWordCard(word, index) {
        const card = document.createElement('div');
        card.className = 'word-card';
        card.setAttribute('data-word', word.word);
        card.onclick = () => this.openDetailCard(word);
        
        card.innerHTML = `
            <div class="card-header">
                <div class="word-title">${word.word}</div>
                <div class="pronunciation">${word.pronunciation}</div>
            </div>
            <div class="card-content">
                <div class="definition">${word.chinese}</div>
                <div class="example">${word.example}</div>
            </div>
        `;
        
        // 添加入场动画
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
        
        return card;
    }

    // 打开详细卡片
    openDetailCard(word) {
        const url = `word-detail.html?word=${encodeURIComponent(word.word)}`;
        window.open(url, '_blank');
    }

    // 随机排序
    shuffleCards() {
        this.currentWords = [...this.vocabulary].sort(() => Math.random() - 0.5);
        this.renderCards();
        this.showMessage('已随机排序！');
    }

    // 显示全部卡片
    showAllCards() {
        this.currentWords = [...this.vocabulary];
        this.renderCards();
        this.showMessage('显示全部单词！');
    }

    // 搜索功能
    searchWords(query) {
        if (!query.trim()) {
            this.showAllCards();
            return;
        }

        const filtered = this.vocabulary.filter(word => 
            word.word.toLowerCase().includes(query.toLowerCase()) ||
            word.chinese.includes(query) ||
            word.definition.toLowerCase().includes(query.toLowerCase())
        );

        this.currentWords = filtered;
        this.renderCards();
        
        if (filtered.length === 0) {
            this.showMessage('未找到匹配的单词');
        } else {
            this.showMessage(`找到 ${filtered.length} 个匹配的单词`);
        }
    }

    // 按难度筛选
    filterByLevel(level) {
        if (level === 'all') {
            this.showAllCards();
            return;
        }

        const filtered = this.vocabulary.filter(word => word.level === level);
        this.currentWords = filtered;
        this.renderCards();
        this.showMessage(`显示 ${level} 级别的单词`);
    }

    // 添加新单词
    addNewWord() {
        const word = prompt("请输入新单词:");
        if (!word) return;

        const pronunciation = prompt("请输入音标:");
        if (!pronunciation) return;

        const chinese = prompt("请输入中文释义:");
        if (!chinese) return;

        const example = prompt("请输入例句:");
        if (!example) return;

        const newWord = {
            word: word.trim(),
            pronunciation: pronunciation.trim(),
            definition: chinese,
            example: example.trim(),
            chinese: chinese.trim(),
            level: "custom"
        };

        this.vocabulary.push(newWord);
        this.currentWords = [...this.vocabulary];
        this.renderCards();
        this.showMessage("单词添加成功！注意：刷新页面后新单词会消失，如需永久保存请修改数据文件。");
    }

    // 绑定事件
    bindEvents() {
        // 按钮事件
        const shuffleBtn = document.getElementById('shuffleBtn');
        const showAllBtn = document.getElementById('showAllBtn');
        const addWordBtn = document.getElementById('addWordBtn');

        if (shuffleBtn) shuffleBtn.onclick = () => this.shuffleCards();
        if (showAllBtn) showAllBtn.onclick = () => this.showAllCards();
        if (addWordBtn) addWordBtn.onclick = () => this.addNewWord();

        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchWords(e.target.value);
            });
        }

        // 难度筛选
        const levelFilter = document.getElementById('levelFilter');
        if (levelFilter) {
            levelFilter.addEventListener('change', (e) => {
                this.filterByLevel(e.target.value);
            });
        }

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'r':
                        e.preventDefault();
                        this.shuffleCards();
                        break;
                    case 'f':
                        e.preventDefault();
                        const searchInput = document.getElementById('searchInput');
                        if (searchInput) searchInput.focus();
                        break;
                }
            }
        });
    }

    // 显示加载状态
    showLoading() {
        const grid = document.getElementById('wordGrid');
        if (grid) {
            grid.innerHTML = '<div class="loading">正在加载单词数据...</div>';
        }
    }

    // 隐藏加载状态
    hideLoading() {
        const loadingElement = document.querySelector('.loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    // 显示错误信息
    showError(message) {
        const grid = document.getElementById('wordGrid');
        if (grid) {
            grid.innerHTML = `<div class="error">${message}</div>`;
        }
    }

    // 显示消息提示
    showMessage(message) {
        // 创建消息提示
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-toast';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(messageDiv);

        // 3秒后自动移除
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }

    // 获取统计信息
    getStats() {
        return {
            total: this.vocabulary.length,
            displayed: this.currentWords.length,
            levels: this.vocabulary.reduce((acc, word) => {
                acc[word.level] = (acc[word.level] || 0) + 1;
                return acc;
            }, {})
        };
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    window.vocabularyApp = new VocabularyApp();
    
    // 添加一些CSS动画
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeInUp 0.6s ease forwards;
            opacity: 0;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .no-words, .error {
            text-align: center;
            padding: 50px;
            color: white;
            font-size: 1.2em;
            grid-column: 1 / -1;
        }
    `;
    document.head.appendChild(style);
});