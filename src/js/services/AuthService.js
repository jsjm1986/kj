// 认证服务类
export class AuthService {
    static KEY_STORAGE = 'paper_recognition_api_key';
    static MODEL_STORAGE = 'paper_recognition_model';

    static saveApiKey(apiKey) {
        localStorage.setItem(this.KEY_STORAGE, apiKey);
    }

    static getApiKey() {
        return localStorage.getItem(this.KEY_STORAGE);
    }

    static saveModel(model) {
        localStorage.setItem(this.MODEL_STORAGE, model);
    }

    static getModel() {
        return localStorage.getItem(this.MODEL_STORAGE);
    }

    static removeAuth() {
        localStorage.removeItem(this.KEY_STORAGE);
        localStorage.removeItem(this.MODEL_STORAGE);
    }

    static async validateApiKey(apiKey, model) {
        try {
            // 验证API密钥格式
            if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 32) {
                return false;
            }

            // 使用选定的模型进行验证
            const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: "API密钥验证测试"
                                }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API验证失败:', errorText);
                return false;
            }

            // 如果请求成功，说明API密钥有效且有权限访问模型
            return true;
        } catch (error) {
            console.error('API验证错误:', error);
            return false;
        }
    }
} 