// SC試験合格に特化した学習データ管理
class StudyPlanManager {
    constructor() {
        this.examDate = null;
        this.currentLevel = 'beginner';
        this.studyPlan = [];
        this.dailyGoals = {};
        this.studyHistory = [];
        this.subjects = {
            'morning1': {
                name: '情報セキュリティ基礎',
                topics: ['セキュリティの基本概念', '脅威と脆弱性', 'セキュリティ対策']
            },
            'morning2': {
                name: '情報セキュリティ管理',
                topics: ['リスクマネジメント', 'セキュリティポリシー', 'インシデント対応']
            },
            'afternoon1': {
                name: '情報セキュリティ技術',
                topics: ['暗号技術', '認証技術', 'アクセス制御']
            },
            'afternoon2': {
                name: '情報セキュリティ実践',
                topics: ['セキュリティ監査', 'セキュリティ評価', 'セキュリティ運用']
            }
        };
    }

    // AI学習プラン生成
    generateStudyPlan(examDate, currentLevel, availableHours) {
        this.examDate = new Date(examDate);
        this.currentLevel = currentLevel;
        const daysUntilExam = this.calculateDaysUntilExam(examDate);
        const totalStudyHours = daysUntilExam * availableHours;
        
        return this.createOptimalPlan(totalStudyHours, currentLevel);
    }

    // 合格予測計算
    calculatePassProbability(scores) {
        const weights = {
            morning1: 0.15,
            morning2: 0.25, 
            afternoon1: 0.30,
            afternoon2: 0.30
        };
        
        const weightedScore = Object.keys(scores).reduce((total, key) => {
            return total + (scores[key] * weights[key]);
        }, 0);
        
        return Math.min(100, Math.max(0, (weightedScore - 50) * 2));
    }

    // 試験日までの日数を計算
    calculateDaysUntilExam(examDate) {
        const today = new Date();
        const exam = new Date(examDate);
        const diffTime = exam - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // 最適な学習プランを作成
    createOptimalPlan(totalHours, level) {
        const plan = [];
        const subjectHours = this.calculateSubjectHours(totalHours, level);
        
        Object.keys(this.subjects).forEach(subject => {
            const topics = this.subjects[subject].topics;
            const hoursPerTopic = subjectHours[subject] / topics.length;
            
            topics.forEach(topic => {
                plan.push({
                    subject: subject,
                    topic: topic,
                    hours: hoursPerTopic,
                    priority: this.calculatePriority(subject, topic, level)
                });
            });
        });

        return this.optimizePlan(plan);
    }

    // 科目ごとの学習時間を計算
    calculateSubjectHours(totalHours, level) {
        const weights = {
            beginner: {
                morning1: 0.30,
                morning2: 0.25,
                afternoon1: 0.25,
                afternoon2: 0.20
            },
            intermediate: {
                morning1: 0.20,
                morning2: 0.25,
                afternoon1: 0.30,
                afternoon2: 0.25
            },
            advanced: {
                morning1: 0.15,
                morning2: 0.20,
                afternoon1: 0.30,
                afternoon2: 0.35
            }
        };

        return Object.keys(weights[level]).reduce((result, subject) => {
            result[subject] = totalHours * weights[level][subject];
            return result;
        }, {});
    }

    // トピックの優先度を計算
    calculatePriority(subject, topic, level) {
        const basePriority = {
            beginner: {
                'セキュリティの基本概念': 1,
                '脅威と脆弱性': 2,
                'セキュリティ対策': 3,
                'リスクマネジメント': 2,
                'セキュリティポリシー': 3,
                'インシデント対応': 4,
                '暗号技術': 3,
                '認証技術': 4,
                'アクセス制御': 5,
                'セキュリティ監査': 4,
                'セキュリティ評価': 5,
                'セキュリティ運用': 6
            }
        };

        return basePriority[level][topic] || 3;
    }

    // 学習プランを最適化
    optimizePlan(plan) {
        return plan.sort((a, b) => a.priority - b.priority);
    }

    // 学習記録を追加
    addStudyRecord(subject, topic, hours, score) {
        this.studyHistory.push({
            date: new Date(),
            subject,
            topic,
            hours,
            score
        });
    }

    // 学習進捗を取得
    getStudyProgress() {
        const progress = {};
        Object.keys(this.subjects).forEach(subject => {
            progress[subject] = {
                completed: 0,
                total: this.subjects[subject].topics.length,
                averageScore: this.calculateAverageScore(subject)
            };
        });
        return progress;
    }

    // 科目ごとの平均スコアを計算
    calculateAverageScore(subject) {
        const subjectRecords = this.studyHistory.filter(record => record.subject === subject);
        if (subjectRecords.length === 0) return 0;
        
        const totalScore = subjectRecords.reduce((sum, record) => sum + record.score, 0);
        return totalScore / subjectRecords.length;
    }

    // 学習目標を設定
    setDailyGoal(subject, hours) {
        this.dailyGoals[subject] = hours;
    }

    // 今日の学習目標を取得
    getDailyGoals() {
        return this.dailyGoals;
    }
}

// 使用例
const studyManager = new StudyPlanManager();
const examDate = '2024-12-15';
const studyPlan = studyManager.generateStudyPlan(examDate, 'beginner', 4);

// 学習記録の追加
studyManager.addStudyRecord('morning1', 'セキュリティの基本概念', 2, 85);
studyManager.addStudyRecord('morning2', 'リスクマネジメント', 2, 75);

// 進捗確認
const progress = studyManager.getStudyProgress();
console.log('学習進捗:', progress);

// 合格確率の計算
const scores = {
    morning1: 85,
    morning2: 75,
    afternoon1: 0,
    afternoon2: 0
};
const passProbability = studyManager.calculatePassProbability(scores);
console.log('合格確率:', passProbability + '%'); 