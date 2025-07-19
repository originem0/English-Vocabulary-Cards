// 详情页面 JavaScript 功能
class WordDetailApp {
    constructor() {
        this.wordData = null;
        this.allWords = [];
        this.init();
    }

    async init() {
        try {
            const wordParam = this.getUrlParameter('word');
            if (!wordParam) {
                this.showError('未指定要查看的单词');
                return;
            }

            await this.loadWordData(wordParam);
            this.renderWordDetail();
            this.bindEvents();
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('加载单词详情失败，请刷新页面重试。');
        }
    }

    // 获取URL参数
    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // 加载单词数据
    async loadWordData(wordName) {
        try {
            this.showLoading();
            
            // 尝试加载词汇表
            try {
                const vocabResponse = await fetch('./data/vocabulary.json');
                if (!vocabResponse.ok) {
                    throw new Error(`HTTP error! status: ${vocabResponse.status}`);
                }
                const vocabData = await vocabResponse.json();
                this.allWords = vocabData.words || [];
                console.log('成功从JSON文件加载词汇表');
            } catch (fetchError) {
                console.warn('无法加载词汇表JSON文件，使用备用数据:', fetchError.message);
                if (window.fallbackVocabulary && window.fallbackVocabulary.words) {
                    this.allWords = window.fallbackVocabulary.words;
                } else {
                    this.allWords = [];
                }
            }

            // 尝试加载详细数据
            try {
                const detailResponse = await fetch('./data/word-details.json');
                if (!detailResponse.ok) {
                    throw new Error(`HTTP error! status: ${detailResponse.status}`);
                }
                const detailData = await detailResponse.json();
                this.wordData = detailData.words[wordName];
                console.log('成功从JSON文件加载详细数据');
            } catch (fetchError) {
                console.warn('无法加载详细数据JSON文件，使用备用数据:', fetchError.message);
                if (window.fallbackWordDetails && window.fallbackWordDetails[wordName]) {
                    this.wordData = window.fallbackWordDetails[wordName];
                } else {
                    this.wordData = null;
                }
            }
            
            if (!this.wordData) {
                throw new Error(`未找到单词 "${wordName}" 的详细信息`);
            }

            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            throw error;
        }
    }

    // 渲染单词详情
    renderWordDetail() {
        if (!this.wordData) return;

        // 设置页面标题
        document.title = `${this.wordData.word} - Memory Card`;

        // 设置基本信息
        this.setElementText('wordTitle', this.wordData.word);
        this.setElementText('pronunciation', this.wordData.pronunciation);
        this.setElementText('definition', this.wordData.definition);

        // 渲染各个部分
        this.renderEtymology();
        this.renderVisualDemo();
        this.renderMemoryStory();
        this.renderExamples();
        this.renderSynonymsAntonyms();
        this.renderPhrases();
    }

    // 渲染词根词源
    renderEtymology() {
        const etymologyContent = document.getElementById('etymologyContent');
        if (!etymologyContent || !this.wordData.etymology) return;

        etymologyContent.innerHTML = `
            <p><strong>词根分解:</strong> ${this.wordData.etymology.breakdown}</p>
            <p><strong>词源解释:</strong> ${this.wordData.etymology.explanation}</p>
        `;
    }

    // 渲染视觉演示
    renderVisualDemo() {
        if (!this.wordData.visualDemo) return;

        const processFlow = document.getElementById('processFlow');
        const visualDescription = document.getElementById('visualDescription');

        if (processFlow) {
            processFlow.innerHTML = '';
            this.wordData.visualDemo.steps.forEach((step, index) => {
                const stepDiv = document.createElement('div');
                stepDiv.className = 'process-step';
                stepDiv.textContent = step;
                processFlow.appendChild(stepDiv);

                if (index < this.wordData.visualDemo.steps.length - 1) {
                    const arrow = document.createElement('div');
                    arrow.className = 'arrow';
                    arrow.textContent = '→';
                    processFlow.appendChild(arrow);
                }
            });
        }

        if (visualDescription) {
            visualDescription.textContent = this.wordData.visualDemo.description;
        }
    }

    // 渲染记忆故事
    renderMemoryStory() {
        this.setElementText('memoryStory', this.wordData.memoryStory);
    }

    // 渲染例句
    renderExamples() {
        const examplesList = document.getElementById('examplesList');
        if (!examplesList || !this.wordData.examples) return;

        examplesList.innerHTML = '';
        this.wordData.examples.forEach(example => {
            const exampleDiv = document.createElement('div');
            exampleDiv.className = 'example-item';
            exampleDiv.innerHTML = `
                <div class="example-type">${example.type}:</div>
                <div>${example.sentence}</div>
            `;
            examplesList.appendChild(exampleDiv);
        });
    }

    // 渲染同义词和反义词
    renderSynonymsAntonyms() {
        this.renderWordList('synonymsList', this.wordData.synonyms);
        this.renderWordList('antonymsList', this.wordData.antonyms);
    }

    // 渲染单词列表
    renderWordList(containerId, words) {
        const container = document.getElementById(containerId);
        if (!container || !words) return;

        container.innerHTML = '';
        words.forEach(word => {
            const span = document.createElement('span');
            span.className = 'word-tag';
            span.textContent = word;
            span.onclick = () => this.searchRelatedWord(word);
            container.appendChild(span);
        });
    }

    // 渲染常用短语
    renderPhrases() {
        const phrasesList = document.getElementById('phrasesList');
        if (!phrasesList || !this.wordData.phrases) return;

        phrasesList.innerHTML = '';
        this.wordData.phrases.forEach(phraseObj => {
            const phraseDiv = document.createElement('div');
            phraseDiv.className = 'phrase-item';
            phraseDiv.innerHTML = `<strong>${phraseObj.phrase}</strong> - ${phraseObj.meaning}`;
            phrasesList.appendChild(phraseDiv);
        });
    }

    // 搜索相关单词
    searchRelatedWord(word) {
        const relatedWord = this.allWords.find(w => 
            w.word.toLowerCase() === word.toLowerCase()
        );
        
        if (relatedWord) {
            const url = `word-detail.html?word=${encodeURIComponent(relatedWord.word)}`;
            window.location.href = url;
        } else {
            this.showMessage(`暂无 "${word}" 的详细信息`);
        }
    }

    // 绑定事件
    bindEvents() {
        // 返回按钮
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.onclick = () => {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.close();
                }
            };
        }

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Escape':
                    if (window.history.length > 1) {
                        window.history.back();
                    } else {
                        window.close();
                    }
                    break;
                case 'ArrowLeft':
                    this.navigateToPrevious();
                    break;
                case 'ArrowRight':
                    this.navigateToNext();
                    break;
            }
        });

        // 添加导航按钮
        this.addNavigationButtons();
    }

    // 添加导航按钮
    addNavigationButtons() {
        if (this.allWords.length <= 1) return;

        const currentIndex = this.allWords.findIndex(w => w.word === this.wordData.word);
        if (currentIndex === -1) return;

        const header = document.querySelector('.header');
        if (!header) return;

        const navDiv = document.createElement('div');
        navDiv.className = 'navigation';
        navDiv.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
        `;

        // 上一个按钮
        if (currentIndex > 0) {
            const prevBtn = this.createNavButton('← 上一个', () => this.navigateToPrevious());
            navDiv.appendChild(prevBtn);
        }

        // 下一个按钮
        if (currentIndex < this.allWords.length - 1) {
            const nextBtn = this.createNavButton('下一个 →', () => this.navigateToNext());
            navDiv.appendChild(nextBtn);
        }

        header.appendChild(navDiv);
    }

    // 创建导航按钮
    createNavButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.onclick = onClick;
        btn.style.cssText = `
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9em;
            transition: all 0.3s ease;
        `;
        
        btn.onmouseover = () => {
            btn.style.background = 'rgba(255,255,255,0.3)';
        };
        
        btn.onmouseout = () => {
            btn.style.background = 'rgba(255,255,255,0.2)';
        };

        return btn;
    }

    // 导航到上一个单词
    navigateToPrevious() {
        const currentIndex = this.allWords.findIndex(w => w.word === this.wordData.word);
        if (currentIndex > 0) {
            const prevWord = this.allWords[currentIndex - 1];
            window.location.href = `word-detail.html?word=${encodeURIComponent(prevWord.word)}`;
        }
    }

    // 导航到下一个单词
    navigateToNext() {
        const currentIndex = this.allWords.findIndex(w => w.word === this.wordData.word);
        if (currentIndex < this.allWords.length - 1) {
            const nextWord = this.allWords[currentIndex + 1];
            window.location.href = `word-detail.html?word=${encodeURIComponent(nextWord.word)}`;
        }
    }

    // 工具方法
    setElementText(id, text) {
        const element = document.getElementById(id);
        if (element && text) {
            element.textContent = text;
        }
    }

    showLoading() {
        const card = document.querySelector('.card');
        if (card) {
            card.innerHTML = '<div class="loading">正在加载单词详情...</div>';
        }
    }

    hideLoading() {
        const loadingElement = document.querySelector('.loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    showError(message) {
        const card = document.querySelector('.card');
        if (card) {
            card.innerHTML = `
                <div class="error">
                    <h2>加载失败</h2>
                    <p>${message}</p>
                    <button onclick="window.history.back()" style="
                        background: #667eea;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 20px;
                        cursor: pointer;
                        margin-top: 20px;
                    ">返回</button>
                </div>
            `;
        }
    }

    showMessage(message) {
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

        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    window.wordDetailApp = new WordDetailApp();
});