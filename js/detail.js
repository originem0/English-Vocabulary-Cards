console.log('detail.js script loaded');

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
                this.showError('No word specified for lookup.');
                return;
            }
            await this.loadWordData(wordParam);
            this.renderWordDetail();
            this.bindEvents();
        } catch (error) {
            console.error('Initialization failed:', error);
            this.showError('Failed to load word details. Please refresh and try again.');
        }
    }

    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    async loadWordData(wordName) {
        this.showLoading();
        try {
            const [vocabResponse, detailResponse] = await Promise.all([
                fetch('./data/vocabulary.json'),
                fetch('./data/word-details.json')
            ]);

            if (vocabResponse.ok) {
                const vocabData = await vocabResponse.json();
                this.allWords = vocabData.words || [];
            }

            if (!detailResponse.ok) {
                throw new Error(`HTTP error! status: ${detailResponse.status}`);
            }
            const detailData = await detailResponse.json();
            const lowerWordName = wordName.toLowerCase();
            const matchedKey = Object.keys(detailData.words).find(key => key.toLowerCase() === lowerWordName);
            
            if (matchedKey) {
                this.wordData = detailData.words[matchedKey];
            } else {
                throw new Error(`Word "${wordName}" not found.`);
            }
        } finally {
            this.hideLoading();
        }
    }

    renderWordDetail() {
        if (!this.wordData) return;

        document.title = `${this.wordData.word} - English-WordGist`;
        this.setElementText('wordTitle', this.wordData.word);
        this.setElementText('pronunciation', this.wordData.pronunciation);
        this.setElementText('definition', this.wordData.definition);

        this.renderVisualDemo();
        this.renderStory();
        this.renderEtymology();
        this.renderExamples();
        this.renderSynonymsAntonyms();
        this.renderPhrases();
        this.renderMemoryPrompt();
    }

    renderVisualDemo() {
        const { visualDemo } = this.wordData;
        if (!visualDemo) return;

        const flowContainer = document.getElementById('processFlow');
        if (flowContainer) {
            flowContainer.innerHTML = visualDemo.steps.map(step => {
                const className = step === '→' ? 'arrow' : 'process-step';
                return `<div class="${className}">${step}</div>`;
            }).join('');
        }
        this.setElementText('visualDescription', visualDemo.description);
    }

    renderStory() {
        const { story } = this.wordData;
        const container = document.getElementById('storyLayers');
        if (!story || !container) return;

        container.innerHTML = `
            <div class="story-item">
                <div class="story-label">Core Image</div>
                <div class="story-text">${story.coreImage}</div>
            </div>
            <div class="story-item">
                <div class="story-label">Action Essence</div>
                <div class="story-text">${story.actionEssence}</div>
            </div>
            <div class="story-item">
                <div class="story-label">Concept Unity</div>
                <div class="story-text">${story.conceptUnity}</div>
            </div>
        `;
    }

    renderEtymology() {
        const { etymology } = this.wordData;
        const container = document.getElementById('etymologyBox');
        if (!etymology || !container) return;

        container.innerHTML = `
            <p class="etymology-text"><strong>词根分析：</strong> ${etymology.analysis}</p>
            <p class="etymology-text"><strong>${etymology.cognates}</strong></p>
            <p class="etymology-text">${etymology.explanation}</p>
        `;
    }

    renderExamples() {
        const { examples } = this.wordData;
        const container = document.getElementById('examplesList');
        if (!examples || !container) return;

        container.innerHTML = examples.map(ex => `
            <div class="example-item">
                <div class="example-text">${ex.sentence} <em>(${ex.pos})</em></div>
            </div>
        `).join('');
    }

    renderSynonymsAntonyms() {
        this.renderWordList('synonymsList', this.wordData.synonyms);
        this.renderWordList('antonymsList', this.wordData.antonyms);
    }

    renderWordList(containerId, words) {
        const container = document.getElementById(containerId);
        if (!container || !words) return;
        container.innerHTML = words.map(word => `<span class="word-tag">${word}</span>`).join('');
    }

    renderPhrases() {
        const { phrases } = this.wordData;
        const container = document.getElementById('phrasesList');
        if (!phrases || !container) return;

        container.innerHTML = phrases.map(p => `
            <div class="phrase-item">
                <span class="phrase-en">${p.phrase}</span>
                <span class="phrase-cn">${p.meaning}</span>
            </div>
        `).join('');
    }

    renderMemoryPrompt() {
        const { memoryPrompt } = this.wordData;
        const container = document.getElementById('memoryPrompt');
        if (!memoryPrompt || !container) return;

        container.innerHTML = `
            <div class="prompt-text">${memoryPrompt.anchor}</div>
            <div class="prompt-question">${memoryPrompt.question}</div>
        `;
    }

    bindEvents() {
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.onclick = () => window.history.length > 1 ? window.history.back() : window.close();
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                backBtn.click();
            }
        });
    }

    setElementText(id, text) {
        const element = document.getElementById(id);
        if (element && text) {
            element.textContent = text;
        }
    }

    showLoading() {
        // You can add a loading spinner overlay if desired
    }

    hideLoading() {
        // Hide the loading spinner
    }

    showError(message) {
        const card = document.querySelector('.card');
        if (card) {
            card.innerHTML = `<div style="padding: 40px; text-align: center;"><h2>Error</h2><p>${message}</p></div>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WordDetailApp();
});