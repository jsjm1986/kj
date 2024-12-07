// API服务类
export class ApiService {
    constructor(apiKey, model) {
        this.apiKey = apiKey;
        this.model = model;
        this.apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1秒
    }

    // 从文本中提取信息
    extractInformation(text) {
        if (!text) {
            console.log('输入文本为空');
            return null;
        }

        try {
            const questions = [];
            const markings = [];

            // 分析文本内容
            const lines = text.split('\n');
            let currentQuestion = null;

            for (let line of lines) {
                line = line.trim();
                if (!line) continue;

                // 识别题目
                const questionMatch = line.match(/题目\s*(\d+)[：:]\s*(.*)/);
                if (questionMatch) {
                    if (currentQuestion) {
                        questions.push(currentQuestion);
                    }
                    currentQuestion = {
                        number: questionMatch[1],
                        content: questionMatch[2],
                        studentAnswer: ''
                    };
                    continue;
                }

                // 识别学生答案
                const answerMatch = line.match(/学生答案[：:]\s*(.*)/);
                if (answerMatch && currentQuestion) {
                    currentQuestion.studentAnswer = answerMatch[1];
                    continue;
                }

                // 识别批改标记
                const markMatch = line.match(/(错误|正确|减分)\s*[：:]\s*题目\s*(\d+)\s*[，,]\s*(.*)/);
                if (markMatch) {
                    const type = markMatch[1] === '错误' ? 'error' : 
                               markMatch[1] === '减分' ? 'deduction' : 'correct';
                    const points = type === 'deduction' ? 
                                 line.match(/减(\d+)分/) ? line.match(/减(\d+)分/)[1] : '' : '';
                    
                    markings.push({
                        type: type,
                        questionNumber: markMatch[2],
                        position: markMatch[3],
                        points: points
                    });
                }
            }

            // 添加最后一个问题
            if (currentQuestion) {
                questions.push(currentQuestion);
            }

            return {
                questions: questions,
                markings: markings
            };
        } catch (error) {
            console.error('解析文本失败:', error);
            return null;
        }
    }

    async analyzeImage(base64Image) {
        if (!base64Image) {
            throw new Error('Image data cannot be empty');
        }

        const prompt = `Please analyze this English exam paper image and describe:
1. The question content and number
2. The student's handwritten answer
3. All red marks (X marks, point deductions, and other marks)
4. Point deductions summary:
   - Check for any red "-N" marks where N is a number
   - Calculate the total points deducted
   - If no points were deducted, explicitly state "No points deducted"
   - If points were deducted, state "Total points deducted: N"

Please describe in English.`;

        const requestData = {
            model: this.model,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`
                            }
                        }
                    ]
                }
            ]
        };

        let lastError;
        for (let i = 0; i < this.maxRetries; i++) {
            try {
                console.log(`Attempt API call (${i + 1}/${this.maxRetries})`);
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    },
                    body: JSON.stringify(requestData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                // 返回原始响应文本
                return await response.text();

            } catch (error) {
                console.error(`API call failed (attempt ${i + 1}/${this.maxRetries}):`, error);
                lastError = error;
                
                if (i < this.maxRetries - 1) {
                    const delay = this.retryDelay * Math.pow(2, i);
                    console.log(`Waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw new Error(`API call failed (after ${this.maxRetries} retries): ${lastError.message}`);
    }

    // 生成请求ID
    generateRequestId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
} 