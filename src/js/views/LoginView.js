// 登录页面视图类
export class LoginView {
    constructor() {
        this.container = document.querySelector('.login-container');
        this.appContainer = document.querySelector('.app-container');
        this.form = this.container.querySelector('#loginForm');
        this.apiKeyInput = this.form.querySelector('#apiKey');
        this.modelSelect = this.form.querySelector('#modelSelect');
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.errorText = this.form.querySelector('.error-text');
        this.modelInfo = this.form.querySelector('.model-info');

        // 模型信息配置
        this.modelDetails = {
            'glm-4v-flash': {
                name: 'GLM-4V-Flash',
                description: '免费模型，具备强大的图片理解能力',
                maxInput: '8K',
                type: '图像理解'
            },
            'glm-4v-plus': {
                name: 'GLM-4V-Plus',
                description: '视频和图像理解，具备视频内容和多图片的理解能力',
                maxInput: '8K',
                type: '图像理解',
                note: '图片理解预计增加 2000 tokens消耗'
            },
            'glm-4v': {
                name: 'GLM-4V',
                description: '图像理解和推理能力',
                maxInput: '2K',
                type: '图像理解'
            },
            'cogvideox': {
                name: 'CogVideoX',
                description: '视频生成，支持文本和图片输入',
                maxInput: '0.5K',
                type: '视频生成'
            },
            'cogview-3-plus': {
                name: 'CogView-3-Plus',
                description: '高质量图像生成，支持多种尺寸',
                maxInput: '1K',
                outputSizes: ['1024x1024', '768x1344', '864x1152'],
                type: '图像生成'
            },
            'cogview-3': {
                name: 'CogView-3',
                description: '快速精准图像生成',
                maxInput: '1K',
                outputSize: '1024x1024',
                type: '图像生成'
            }
        };

        // 初始化事件监听
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // 监听模型选择变化
        this.modelSelect.addEventListener('change', () => {
            const selectedModel = this.modelSelect.value;
            if (selectedModel) {
                const model = this.modelDetails[selectedModel];
                let info = `${model.description}。最大输入：${model.maxInput}`;
                if (model.outputSizes) {
                    info += `。支持输出尺寸：${model.outputSizes.join(', ')}`;
                } else if (model.outputSize) {
                    info += `。输出尺寸：${model.outputSize}`;
                }
                if (model.note) {
                    info += `。注意：${model.note}`;
                }
                this.modelInfo.textContent = info;
            } else {
                this.modelInfo.textContent = '请选择合适的多模态模型';
            }
        });
    }

    show() {
        this.container.style.display = 'block';
        this.appContainer.style.display = 'none';
    }

    hide() {
        this.container.style.display = 'none';
        this.appContainer.style.display = 'block';
    }

    setLoginHandler(handler) {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 获取输入值
            const apiKey = this.apiKeyInput.value.trim();
            const model = this.modelSelect.value;

            // 验证输入
            if (!apiKey) {
                this.showError('请输入API密钥');
                return;
            }
            if (!model) {
                this.showError('请选择模型');
                return;
            }
            
            // 更新UI状态
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = '验证中...';
            this.errorText.style.display = 'none';
            
            try {
                await handler(apiKey, model);
            } catch (error) {
                this.showError(error.message);
            } finally {
                this.submitBtn.disabled = false;
                this.submitBtn.textContent = '登录';
            }
        });
    }

    showError(message) {
        this.errorText.textContent = message;
        this.errorText.style.display = 'block';
    }
} 