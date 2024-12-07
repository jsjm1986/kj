# Exam Paper Analysis System (试卷分析系统)

An AI-powered system for analyzing English exam papers using GLM-4V-Plus model, capable of recognizing questions, student answers, and correction marks.

基于智谱 GLM-4V-Plus 模型的英文试卷分析系统，可识别试题内容、学生答案和批改标记。

## Features (功能特点)

- Upload and analyze exam paper images (上传并分析试卷图片)
- Recognize question content and numbers (识别试题内容和编号)
- Identify student's handwritten answers (识别学生手写答案)
- Detect correction marks (检测批改标记):
  - Red X marks (红色 X 标记)
  - Point deductions (-N points) (扣分标记)
  - Other correction marks (其他批改标记)
- Real-time streaming display of analysis results (实时流式显示分析结果)
- Support for mathematical formulas and LaTeX (支持数学公式和 LaTeX)

## Technologies Used (使用技术)

- Frontend (前端):
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - MVC Architecture (MVC 架构)
- AI Model (AI 模型):
  - Zhipu AI GLM-4V-Plus (智谱 GLM-4V-Plus)
  - Multimodal Vision Language Model (多模态视觉语言模型)

## Project Structure (项目结构)

```
exam-paper-analysis/
├── src/
│   ├── js/
│   │   ├── controllers/    # MVC Controllers
│   │   ├── models/         # MVC Models
│   │   ├── views/          # MVC Views
│   │   ├── services/       # API Services
│   │   └── utils/          # Utility Functions
│   ├── css/                # Stylesheets
│   └── index.html          # Main HTML
├── README.md
└── package.json
```

## Setup (安装设置)

1. Clone the repository (克隆仓库):
bash
git clone https://github.com/yourusername/exam-paper-analysis.git
```

2. Navigate to the project directory (进入项目目录):
```bash
cd exam-paper-analysis
```

3. Open `index.html` in your web browser or set up a local server (在浏览器中打开或设置本地服务器)

## Usage (使用说明)

1. API Key Setup (API 密钥设置):
   - Register at [Zhipu AI](https://open.bigmodel.cn/)
   - Create a new API key
   - Enter the key in the application

2. Model Selection (模型选择):
   - Choose GLM-4V-Plus model (recommended)
   - Other available models: GLM-4V, CogView-3

3. Image Upload (图片上传):
   - Click "Choose Image" button
   - Select an exam paper image
   - Wait for analysis results

4. View Results (查看结果):
   - Question content and number
   - Student's handwritten answer
   - Correction marks
   - Point deductions summary

## API Response Format (API 响应格式)

The system returns analysis results in the following format:

```
1. Question Content and Number:
   - Question details and numbering

2. Student's Handwritten Answer:
   - Detailed description of the answer

3. Red Marks:
   - Location and type of correction marks

4. Point Deductions Summary:
   - Total points deducted (if any)
```

## License (许可证)

MIT License

## Author (作者)

Your Name

## Acknowledgments (致谢)

- [Zhipu AI](https://open.bigmodel.cn/) for providing the GLM-4V-Plus model
- All contributors to this project
`````` 