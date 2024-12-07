// 视图类
export class PaperView {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.fileInput = document.getElementById('paperUpload');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.previewImage = document.getElementById('previewImage');
        this.resultContent = document.getElementById('resultContent');
        this.editBtn = document.getElementById('editBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.editableContent = document.getElementById('editableContent');
        this.questionsList = document.getElementById('questionsList');
        this.errorsList = document.getElementById('errorsList');
        this.deductionsList = document.getElementById('deductionsList');
        this.addQuestionBtn = document.getElementById('addQuestionBtn');
        this.addErrorBtn = document.getElementById('addErrorBtn');
        this.addDeductionBtn = document.getElementById('addDeductionBtn');
    }

    bindEvents() {
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
    }

    setFileChangeHandler(handler) {
        this.fileInput.addEventListener('change', handler);
    }

    setEditHandler(handler) {
        this.editBtn.addEventListener('click', handler);
    }

    setSaveHandler(handler) {
        this.saveBtn.addEventListener('click', handler);
    }

    setCancelHandler(handler) {
        this.cancelBtn.addEventListener('click', handler);
    }

    setAddItemHandlers(handlers) {
        this.addQuestionBtn.addEventListener('click', () => handlers.addQuestion());
        this.addErrorBtn.addEventListener('click', () => handlers.addError());
        this.addDeductionBtn.addEventListener('click', () => handlers.addDeduction());
    }

    showPreview(imageUrl) {
        this.previewImage.src = imageUrl;
        this.previewImage.style.display = 'block';
    }

    showLoading() {
        this.resultContent.innerHTML = '<div class="loading">正在识别中...</div>';
    }

    showError(message) {
        const errorMessage = document.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }

    displayResults(data) {
        let html = '<div class="result-preview">';
        
        // 显示分析文本（如果存在）
        if (data.analysisText) {
            html += '<div class="analysis-text">';
            html += data.analysisText.replace(/\n/g, '<br>');
            html += '</div>';
        } else {
            // 原有的显示逻辑
            html += '<h3>试题内容：</h3>';
            data.questions.forEach(q => {
                html += `<p>第${q.number}题：${q.content}</p>`;
            });

            html += '<h3>错误标记：</h3>';
            data.errors.forEach(e => {
                html += `<p>第${e.questionNumber}题：${e.position}</p>`;
            });

            html += '<h3>扣分记录：</h3>';
            data.deductions.forEach(d => {
                html += `<p>第${d.questionNumber}题：扣${d.points}分</p>`;
            });
        }

        html += '</div>';
        this.resultContent.innerHTML = html;
        this.editBtn.style.display = 'inline-block';

        // 如果有LaTeX公式，触发重新渲染
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise().catch(error => {
                console.error('LaTeX渲染错误:', error);
            });
        }
    }

    renderEditableList(type, items) {
        const container = type === 'questions' ? this.questionsList :
                         type === 'errors' ? this.errorsList :
                         this.deductionsList;
        
        container.innerHTML = '';
        
        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'item-row';
            
            if (type === 'questions') {
                div.innerHTML = `
                    <input type="text" value="${item.number}" placeholder="题号" class="number-input">
                    <input type="text" value="${item.content}" placeholder="内容" class="content-input">
                    <button data-index="${index}" class="delete-btn">删除</button>
                `;
            } else if (type === 'errors') {
                div.innerHTML = `
                    <input type="text" value="${item.questionNumber}" placeholder="题号" class="number-input">
                    <input type="text" value="${item.position}" placeholder="位置描述" class="position-input">
                    <button data-index="${index}" class="delete-btn">删除</button>
                `;
            } else if (type === 'deductions') {
                div.innerHTML = `
                    <input type="text" value="${item.questionNumber}" placeholder="题号" class="number-input">
                    <input type="text" value="${item.points}" placeholder="扣分分数" class="points-input">
                    <button data-index="${index}" class="delete-btn">删除</button>
                `;
            }
            
            container.appendChild(div);
        });
    }

    startEditing() {
        this.resultContent.style.display = 'none';
        this.editableContent.style.display = 'block';
        this.editBtn.style.display = 'none';
        this.saveBtn.style.display = 'inline-block';
        this.cancelBtn.style.display = 'inline-block';
    }

    exitEditMode() {
        this.editableContent.style.display = 'none';
        this.resultContent.style.display = 'block';
        this.editBtn.style.display = 'inline-block';
        this.saveBtn.style.display = 'none';
        this.cancelBtn.style.display = 'none';
    }

    collectFormData() {
        return {
            questions: Array.from(this.questionsList.children).map(div => ({
                number: div.querySelector('.number-input').value,
                content: div.querySelector('.content-input').value
            })),
            errors: Array.from(this.errorsList.children).map(div => ({
                questionNumber: div.querySelector('.number-input').value,
                position: div.querySelector('.position-input').value
            })),
            deductions: Array.from(this.deductionsList.children).map(div => ({
                questionNumber: div.querySelector('.number-input').value,
                points: div.querySelector('.points-input').value
            }))
        };
    }

    displayAnalysisResult(text) {
        const resultContent = document.getElementById('resultContent');
        const analysisResult = document.getElementById('analysisResult');
        
        if (resultContent && analysisResult) {
            // 清空并显示结果区域
            resultContent.textContent = '';
            analysisResult.style.display = 'block';
            
            // 流式显示文本
            let index = 0;
            
            function typeText() {
                if (index < text.length) {
                    resultContent.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeText, 30);
                }
            }
            
            typeText();
        }
    }

    showAnalysisResult(text) {
        const resultContent = document.querySelector('.result-content');
        if (resultContent) {
            resultContent.textContent = text;
            resultContent.parentElement.style.display = 'block';
        }
    }
} 