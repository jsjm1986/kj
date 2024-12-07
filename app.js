// 配置智谱API密钥（实际使用时应该从环境变量或安全的配置文件中获取）
const API_KEY = 'YOUR_API_KEY';
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/vision';

// DOM元素
const fileInput = document.getElementById('paperUpload');
const uploadBtn = document.getElementById('uploadBtn');
const previewImage = document.getElementById('previewImage');
const resultContent = document.getElementById('resultContent');
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const editableContent = document.getElementById('editableContent');
const questionsList = document.getElementById('questionsList');
const errorsList = document.getElementById('errorsList');
const deductionsList = document.getElementById('deductionsList');
const addQuestionBtn = document.getElementById('addQuestionBtn');
const addErrorBtn = document.getElementById('addErrorBtn');
const addDeductionBtn = document.getElementById('addDeductionBtn');

// 存储当前识别结果
let currentResults = {
    questions: [],
    errors: [],
    deductions: []
};

// 绑定事件监听器
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
editBtn.addEventListener('click', startEditing);
saveBtn.addEventListener('click', saveChanges);
cancelBtn.addEventListener('click', cancelEditing);
addQuestionBtn.addEventListener('click', () => addItem('questions'));
addErrorBtn.addEventListener('click', () => addItem('errors'));
addDeductionBtn.addEventListener('click', () => addItem('deductions'));

// 处理文件选择
async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 显示预览
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
    };
    reader.readAsDataURL(file);

    try {
        resultContent.innerHTML = '<div class="loading">正在识别中...</div>';
        const result = await analyzeImage(file);
        parseAndDisplayResults(result);
        editBtn.style.display = 'inline-block';
    } catch (error) {
        resultContent.innerHTML = `<div class="error">识别失败：${error.message}</div>`;
    }
}

// 调用智谱API进行图像分析
async function analyzeImage(file) {
    const base64Image = await fileToBase64(file);
    
    const prompt = `请分析这张试卷图片，识别以下内容并以JSON格式返回：
{
    "questions": [{"number": "题号", "content": "题目内容"}],
    "errors": [{"questionNumber": "题号", "position": "位置描述"}],
    "deductions": [{"questionNumber": "题号", "points": "扣分分数"}]
}`;

    const requestData = {
        model: "glm-4v-plus",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    { type: "image", image_base64: base64Image }
                ]
            }
        ]
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) throw new Error('API请求失败');
        return await response.json();
    } catch (error) {
        throw new Error('API调用出错：' + error.message);
    }
}

// 将文件转换为base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 解析并显示结果
function parseAndDisplayResults(apiResponse) {
    try {
        const content = apiResponse.choices[0].message.content;
        currentResults = JSON.parse(content);
        displayResults();
    } catch (error) {
        resultContent.innerHTML = `<div class="error">结果解析失败：${error.message}</div>`;
    }
}

// 显示结果
function displayResults() {
    let html = '<div class="result-preview">';
    
    // 显示题目
    html += '<h3>试题内容：</h3>';
    currentResults.questions.forEach(q => {
        html += `<p>第${q.number}题：${q.content}</p>`;
    });

    // 显示错误
    html += '<h3>错误标记：</h3>';
    currentResults.errors.forEach(e => {
        html += `<p>第${e.questionNumber}题：${e.position}</p>`;
    });

    // 显示扣分
    html += '<h3>扣分记录：</h3>';
    currentResults.deductions.forEach(d => {
        html += `<p>第${d.questionNumber}题：扣${d.points}分</p>`;
    });

    html += '</div>';
    resultContent.innerHTML = html;
}

// 开始编辑
function startEditing() {
    resultContent.style.display = 'none';
    editableContent.style.display = 'block';
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
    
    renderEditableList('questions');
    renderEditableList('errors');
    renderEditableList('deductions');
}

// 渲染可编辑列表
function renderEditableList(type) {
    const container = document.getElementById(`${type}List`);
    container.innerHTML = '';
    
    currentResults[type].forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item-row';
        
        if (type === 'questions') {
            div.innerHTML = `
                <input type="text" value="${item.number}" placeholder="题号" class="number-input">
                <input type="text" value="${item.content}" placeholder="内容" class="content-input">
                <button onclick="removeItem('${type}', ${index})">删除</button>
            `;
        } else if (type === 'errors') {
            div.innerHTML = `
                <input type="text" value="${item.questionNumber}" placeholder="题号" class="number-input">
                <input type="text" value="${item.position}" placeholder="位置描述" class="position-input">
                <button onclick="removeItem('${type}', ${index})">删除</button>
            `;
        } else if (type === 'deductions') {
            div.innerHTML = `
                <input type="text" value="${item.questionNumber}" placeholder="题号" class="number-input">
                <input type="text" value="${item.points}" placeholder="扣分分数" class="points-input">
                <button onclick="removeItem('${type}', ${index})">删除</button>
            `;
        }
        
        container.appendChild(div);
    });
}

// 添加项目
function addItem(type) {
    const newItem = type === 'questions' 
        ? { number: '', content: '' }
        : type === 'errors'
        ? { questionNumber: '', position: '' }
        : { questionNumber: '', points: '' };
    
    currentResults[type].push(newItem);
    renderEditableList(type);
}

// 删除项目
function removeItem(type, index) {
    currentResults[type].splice(index, 1);
    renderEditableList(type);
}

// 保存更改
function saveChanges() {
    // 收集问题数据
    currentResults.questions = Array.from(questionsList.children).map(div => ({
        number: div.querySelector('.number-input').value,
        content: div.querySelector('.content-input').value
    }));

    // 收集错误数据
    currentResults.errors = Array.from(errorsList.children).map(div => ({
        questionNumber: div.querySelector('.number-input').value,
        position: div.querySelector('.position-input').value
    }));

    // 收集扣分数据
    currentResults.deductions = Array.from(deductionsList.children).map(div => ({
        questionNumber: div.querySelector('.number-input').value,
        points: div.querySelector('.points-input').value
    }));

    displayResults();
    exitEditMode();
}

// 取消编辑
function cancelEditing() {
    exitEditMode();
    displayResults();
}

// 退出编辑模式
function exitEditMode() {
    editableContent.style.display = 'none';
    resultContent.style.display = 'block';
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
} 