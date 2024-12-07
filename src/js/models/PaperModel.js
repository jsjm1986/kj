// 试卷数据模型
export class PaperModel {
    constructor() {
        this.questions = [];
        this.errors = [];
        this.deductions = [];
    }

    setData(data) {
        this.questions = data.questions || [];
        this.errors = data.errors || [];
        this.deductions = data.deductions || [];
    }

    addQuestion(question) {
        this.questions.push(question);
    }

    addError(error) {
        this.errors.push(error);
    }

    addDeduction(deduction) {
        this.deductions.push(deduction);
    }

    removeQuestion(index) {
        this.questions.splice(index, 1);
    }

    removeError(index) {
        this.errors.splice(index, 1);
    }

    removeDeduction(index) {
        this.deductions.splice(index, 1);
    }

    getData() {
        return {
            questions: this.questions,
            errors: this.errors,
            deductions: this.deductions
        };
    }
} 