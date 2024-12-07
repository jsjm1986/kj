import { FileUtils } from '../utils/FileUtils.js';

// 控制器类
export class PaperController {
    constructor(model, view, apiService) {
        this.model = model;
        this.view = view;
        this.apiService = apiService;
        this.initializeHandlers();
    }

    initializeHandlers() {
        this.view.setFileChangeHandler(this.handleFileSelect.bind(this));
        this.view.setEditHandler(this.handleEdit.bind(this));
        this.view.setSaveHandler(this.handleSave.bind(this));
        this.view.setCancelHandler(this.handleCancel.bind(this));
        this.view.setAddItemHandlers({
            addQuestion: () => this.handleAddItem('questions'),
            addError: () => this.handleAddItem('errors'),
            addDeduction: () => this.handleAddItem('deductions')
        });
    }

    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            // 显示图片预览
            const dataUrl = await FileUtils.fileToDataURL(file);
            this.view.showPreview(dataUrl);

            // 转换图片为base64并调用API
            const base64Image = await FileUtils.fileToBase64(file);
            
            // 调用API获取分析结果
            const response = await this.apiService.analyzeImage(base64Image);
            
            // 解析API响应
            let result;
            try {
                result = JSON.parse(response);
            } catch (error) {
                console.error('Failed to parse API response:', error);
                throw new Error('Invalid API response format');
            }

            // 检查API返回的数据结构
            if (!result?.choices?.[0]?.message?.content) {
                throw new Error('Invalid API response structure');
            }

            // 获取分析文本并显示
            const analysisText = result.choices[0].message.content;
            this.view.showAnalysisResult(analysisText);

        } catch (error) {
            console.error('Error:', error);
            this.view.showError(error.message);
        }
    }

    handleEdit() {
        this.view.startEditing();
        this.view.renderEditableList('questions', this.model.questions);
        this.view.renderEditableList('errors', this.model.errors);
        this.view.renderEditableList('deductions', this.model.deductions);
    }

    handleSave() {
        const formData = this.view.collectFormData();
        this.model.setData(formData);
        this.view.displayResults(this.model.getData());
        this.view.exitEditMode();
    }

    handleCancel() {
        this.view.exitEditMode();
        this.view.displayResults(this.model.getData());
    }

    handleAddItem(type) {
        const newItem = type === 'questions'
            ? { number: '', content: '' }
            : type === 'errors'
            ? { questionNumber: '', position: '' }
            : { questionNumber: '', points: '' };

        this.model[type].push(newItem);
        this.view.renderEditableList(type, this.model[type]);
    }
} 