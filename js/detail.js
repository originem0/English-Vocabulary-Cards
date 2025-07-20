console.log('detail.js script loaded');

// 详情页面 JavaScript 功能
class WordDetailApp {
    constructor() {
        console.log('WordDetailApp constructor called');
        this.wordData = null;
        this.allWords = [];
        this.init();
    }

    async init() {
        console.log('WordDetailApp init started');
        try {
            const wordParam = this.getUrlParameter('word');
            console.log('Word parameter from URL:', wordParam);
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
        console.log('Starting to load word data for:', wordName);
        this.showLoading();

        try {
            // 加载词汇表以支持导航
            console.log('Fetching vocabulary.json...');
            const vocabResponse = await fetch('./data/vocabulary.json');
            console.log('Vocabulary response status:', vocabResponse.status);
            if (vocabResponse.ok) {
                const vocabData = await vocabResponse.json();
                this.allWords = vocabData.words || [];
                console.log('Vocabulary for navigation loaded, count:', this.allWords.length);
            }

            // 加载单词详情
            console.log('Fetching word-details.json...');
            const detailResponse = await fetch('./data/word-details.json');
            console.log('Detail response status:', detailResponse.status);
            if (!detailResponse.ok) {
                throw new Error(`HTTP error! status: ${detailResponse.status}`);
            }
            const detailData = await detailResponse.json();
            console.log('Successfully loaded and parsed word-details.json');
            console.log('Available words in detail data:', Object.keys(detailData.words));
            console.log('Looking for word:', wordName);
            
            this.wordData = detailData.words[wordName];
            console.log('Found word data:', this.wordData);

            // 如果没找到，尝试不区分大小写的匹配
            if (!this.wordData) {
                console.log('Exact match not found, trying case-insensitive match...');
                const lowerWordName = wordName.toLowerCase();
                const matchedKey = Object.keys(detailData.words).find(key => 
                    key.toLowerCase() === lowerWordName
                );
                if (matchedKey) {
                    console.log('Found case-insensitive match:', matchedKey);
                    this.wordData = detailData.words[matchedKey];
                }
            }

            if (!this.wordData) {
                console.error(`Word "${wordName}" not found in detail data`);
                throw new Error(`未找到单词 "${wordName}" 的详细信息`);
            }

            console.log('Final word data to be used:', this.wordData);
            this.hideLoading();
        } catch (error) {
            console.error('Error in loadWordData:', error);
            throw error;
        }
    }

    // 渲染单词详情
    renderWordDetail() {
        console.log('Starting to render word detail');
        console.log('Word data available:', !!this.wordData);
        if (!this.wordData) {
            console.error('No word data available for rendering');
            return;
        }

        console.log('Word data structure:', this.wordData);

        // 设置页面标题
        document.title = `${this.wordData.word} - Memory Card`;
        console.log('Set page title to:', document.title);

        // 设置基本信息
        console.log('Setting basic info...');
        this.setElementText('wordTitle', this.wordData.word);
        this.setElementText('pronunciation', this.wordData.pronunciation);
        this.setElementText('definition', this.wordData.definition);

        // 渲染各个部分
        console.log('Rendering etymology...');
        this.renderEtymology();
        console.log('Rendering visual demo...');
        this.renderVisualDemo();
        console.log('Rendering memory story...');
        this.renderMemoryStory();
        console.log('Rendering examples...');
        this.renderExamples();
        console.log('Rendering synonyms and antonyms...');
        this.renderSynonymsAntonyms();
        console.log('Rendering phrases...');
        this.renderPhrases();
        console.log('Finished rendering word detail');
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
        console.log(`Setting element ${id} with text:`, text);
        const element = document.getElementById(id);
        console.log(`Element ${id} found:`, !!element);
        if (element && text) {
            element.textContent = text;
            console.log(`Successfully set ${id} to:`, element.textContent);
        } else {
            if (!element) console.warn(`Element with id '${id}' not found`);
            if (!text) console.warn(`No text provided for element '${id}'`);
        }
    }

    showLoading() {
        console.log('showLoading called');
        const card = document.querySelector('.card');
        console.log('Card element found:', !!card);
        if (card) {
            console.log('Setting loading content, this will DESTROY existing DOM elements!');
            card.innerHTML = '<div class="loading">正在加载单词详情...</div>';
        }
    }

    hideLoading() {
        console.log('hideLoading called');
        const loadingElement = document.querySelector('.loading');
        console.log('Loading element found:', !!loadingElement);
        if (loadingElement) {
            loadingElement.remove();
            console.log('Loading element removed');
            
            // 重新恢复原始HTML结构
            console.log('Restoring original HTML structure...');
            this.restoreOriginalHTML();
        }
    }

    // 恢复原始HTML结构
    restoreOriginalHTML() {
        const card = document.querySelector('.card');
        if (card) {
            card.innerHTML = `
                <div class="header">
                    <h1 class="word-title" id="wordTitle">Loading...</h1>
                    <div class="pronunciation" id="pronunciation"></div>
                    <div class="definition" id="definition"></div>
                </div>
                
                <div class="content">
                    <div class="section etymology">
                        <h3>🌱 词根词源</h3>
                        <div id="etymologyContent"></div>
                    </div>
                    
                    <div class="visual-demo" id="visualDemo">
                        <div class="gear"></div>
                        <div class="process-flow" id="processFlow">
                            <!-- 动态生成流程步骤 -->
                        </div>
                        <p style="margin-top: 20px; color: #4a6b7a; font-size: 1.1em;" id="visualMemory">
                            <strong>Visual Memory:</strong> <span id="visualDescription"></span>
                        </p>
                    </div>
                    
                    <div class="section story">
                        <h3>📖 Memory Story</h3>
                        <p id="memoryStory"></p>
                    </div>
                    
                    <div class="section examples">
                        <h3>📝 Example Sentences</h3>
                        <div id="examplesList"></div>
                    </div>
                    
                    <div class="section synonyms-antonyms">
                        <div class="syn-ant-item">
                            <h4>Synonyms</h4>
                            <div class="word-list" id="synonymsList"></div>
                        </div>
                        <div class="syn-ant-item">
                            <h4>Antonyms</h4>
                            <div class="word-list" id="antonymsList"></div>
                        </div>
                    </div>
                    
                    <div class="section phrases">
                        <h3>🔤 常用短语</h3>
                        <div id="phrasesList"></div>
                    </div>
                </div>
            `;
            console.log('Original HTML structure restored');
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
    console.log('DOM fully loaded and parsed');
    
    // 额外检查关键元素是否存在
    const keyElements = ['wordTitle', 'pronunciation', 'definition', 'memoryStory'];
    const missingElements = keyElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.error('Missing DOM elements:', missingElements);
        console.log('Available elements with IDs:', 
            Array.from(document.querySelectorAll('[id]')).map(el => el.id)
        );
        
        // 等待一下再重试
        setTimeout(() => {
            console.log('Retrying after 100ms...');
            const stillMissing = keyElements.filter(id => !document.getElementById(id));
            if (stillMissing.length === 0) {
                console.log('Elements found after delay, initializing app...');
                window.wordDetailApp = new WordDetailApp();
            } else {
                console.error('Elements still missing after delay:', stillMissing);
            }
        }, 100);
    } else {
        console.log('All required elements found, initializing app...');
        window.wordDetailApp = new WordDetailApp();
    }
});