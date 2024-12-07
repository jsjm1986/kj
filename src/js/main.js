import { PaperController } from './controllers/PaperController.js';
import { PaperModel } from './models/PaperModel.js';
import { ApiService } from './services/ApiService.js';
import { AuthService } from './services/AuthService.js';
import { LoginView } from './views/LoginView.js';
import { PaperView } from './views/PaperView.js';

// 模型信息配置
const MODEL_NAMES = {
    'glm-4v-flash': 'GLM-4V-Flash (免费版)',
    'glm-4v-plus': 'GLM-4V-Plus (专业版)',
    'glm-4v': 'GLM-4V (标准版)',
    'cogvideox': 'CogVideoX (视频生成)',
    'cogview-3-plus': 'CogView-3-Plus (高级图像生成)',
    'cogview-3': 'CogView-3 (标准图像生成)'
};

// 初始化应用
document.addEventListener('DOMContentLoaded', async () => {
    const loginView = new LoginView();
    const currentModelSpan = document.getElementById('currentModel');
    
    // 检查是否已有API密钥和模型选择
    const savedApiKey = AuthService.getApiKey();
    const savedModel = AuthService.getModel();

    if (savedApiKey && savedModel) {
        try {
            // 验证已保存的API密钥
            const isValid = await AuthService.validateApiKey(savedApiKey, savedModel);
            if (isValid) {
                initializeApp(savedApiKey, savedModel);
                return;
            }
        } catch (error) {
            console.error('验证已保存的API密钥失败:', error);
        }
        // 如果验证失败，清除已保存的信息
        AuthService.removeAuth();
    }

    // 显示登录页面
    loginView.show();

    // 设置登录处理函数
    loginView.setLoginHandler(async (apiKey, model) => {
        try {
            const isValid = await AuthService.validateApiKey(apiKey, model);
            if (!isValid) {
                throw new Error('API密钥无效');
            }
            
            // 保存API密钥和模型选择并初始化应用
            AuthService.saveApiKey(apiKey);
            AuthService.saveModel(model);
            initializeApp(apiKey, model);
        } catch (error) {
            throw new Error('验证失败: ' + error.message);
        }
    });
});

// 初始化主应用
function initializeApp(apiKey, model) {
    const paperModel = new PaperModel();
    const paperView = new PaperView();
    const apiService = new ApiService(apiKey, model);
    const controller = new PaperController(paperModel, paperView, apiService);

    // 显示当前使用的模型
    const currentModelSpan = document.getElementById('currentModel');
    currentModelSpan.textContent = MODEL_NAMES[model] || model;

    // 处理退出登录
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        AuthService.removeAuth();
        window.location.reload();
    });

    // 显示主应用界面
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.app-container').style.display = 'block';
} 