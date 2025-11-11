'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Brain, Trophy, Download, User, ChevronRight, AlertCircle, Sparkles } from 'lucide-react'
// Custom radar chart implementation to avoid dependency issues
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Custom Radar Chart Component
const CustomRadarChart = ({ data }: { data: any }) => {
  const skills = data.labels
  const values = data.datasets[0].data
  const maxValue = 100
  const levels = 5
  const angleStep = (Math.PI * 2) / skills.length

  const createPolygonPoints = (scale: number) => {
    return skills
      .map((_, index) => {
        const angle = angleStep * index - Math.PI / 2
        const x = 50 + scale * Math.cos(angle) * 40
        const y = 50 + scale * Math.sin(angle) * 40
        return `${x},${y}`
      })
      .join(' ')
  }

  const createDataPoints = () => {
    return values
      .map((value: number, index: number) => {
        const scale = value / maxValue
        const angle = angleStep * index - Math.PI / 2
        const x = 50 + scale * Math.cos(angle) * 40
        const y = 50 + scale * Math.sin(angle) * 40
        return `${x},${y}`
      })
      .join(' ')
  }

  return (
    <div className="relative w-full h-80 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Grid circles */}
        {[1, 2, 3, 4, 5].map((level) => (
          <polygon
            key={level}
            points={createPolygonPoints(level / 5)}
            fill="none"
            stroke="rgba(147, 51, 234, 0.2)"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Axes */}
        {skills.map((_, index) => {
          const angle = angleStep * index - Math.PI / 2
          const x2 = 50 + Math.cos(angle) * 40
          const y2 = 50 + Math.sin(angle) * 40
          return (
            <line
              key={index}
              x1="50"
              y1="50"
              x2={x2}
              y2={y2}
              stroke="rgba(147, 51, 234, 0.3)"
              strokeWidth="0.5"
            />
          )
        })}
        
        {/* Data polygon */}
        <polygon
          points={createDataPoints()}
          fill="rgba(147, 51, 234, 0.2)"
          stroke="rgba(147, 51, 234, 1)"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {values.map((value: number, index: number) => {
          const scale = value / maxValue
          const angle = angleStep * index - Math.PI / 2
          const x = 50 + scale * Math.cos(angle) * 40
          const y = 50 + scale * Math.sin(angle) * 40
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill="rgba(147, 51, 234, 1)"
              stroke="#fff"
              strokeWidth="1"
            />
          )
        })}
        
        {/* Labels */}
        {skills.map((skill: string, index: number) => {
          const angle = angleStep * index - Math.PI / 2
          const labelRadius = 45
          const x = 50 + Math.cos(angle) * labelRadius
          const y = 50 + Math.sin(angle) * labelRadius
          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#e2e8f0"
              fontSize="4"
              className="font-semibold"
            >
              {skill}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

interface UserProfile {
  name: string
  age: number
  weight: number
  height: number
  gender: string
}

interface Question {
  id: number
  type: 'logic' | 'open'
  question: string
  options?: string[]
  correctAnswer?: number
  category: string
}

interface QuizResult {
  iqScore: number
  skills: {
    logic: number
    math: number
    verbal: number
    spatial: number
    memory: number
    creativity: number
  }
  answers: any[]
}

const logicQuestions: Question[] = [
  // Logic Domain Questions (5 questions)
  {
    id: 1,
    type: 'logic',
    question: 'In a certain code language, if "134" means "Good Morning", "749" means "Very Good", and "826" means "Morning Walk", what does "974" mean?',
    options: ['Very Walk', 'Good Morning', 'Very Good', 'Morning Very'],
    correctAnswer: 2,
    category: 'logic'
  },
  {
    id: 2,
    type: 'logic',
    question: 'A man is looking at a portrait. Someone asks him whose portrait he is looking at. He replies: "Brothers and sisters I have none, but that man\'s father is my father\'s son." Who is in the portrait?',
    options: ['His son', 'His father', 'His brother', 'Himself'],
    correctAnswer: 0,
    category: 'logic'
  },
  {
    id: 3,
    type: 'logic',
    question: 'If all roses are flowers and some flowers fade quickly, which statement must be true?',
    options: [
      'All roses fade quickly',
      'Some roses fade quickly',
      'No roses fade quickly',
      'Some flowers that fade quickly are roses'
    ],
    correctAnswer: 1,
    category: 'logic'
  },
  {
    id: 4,
    type: 'logic',
    question: 'In a group of 100 people, 70 speak English, 60 speak Spanish, and 40 speak both languages. How many people speak neither language?',
    options: ['10', '20', '30', '40'],
    correctAnswer: 0,
    category: 'logic'
  },
  {
    id: 5,
    type: 'logic',
    question: 'If today is Tuesday, what day will it be after 100 days?',
    options: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
    correctAnswer: 0,
    category: 'logic'
  },

  // Math Domain Questions (5 questions)
  {
    id: 6,
    type: 'logic',
    question: 'What is the next number in the series: 2, 12, 36, 80, 150, ?',
    options: ['252', '210', '240', '280'],
    correctAnswer: 0,
    category: 'math'
  },
  {
    id: 7,
    type: 'logic',
    question: 'If 3+4=21, 5+6=55, 7+8=91, then 9+10=?',
    options: ['90', '99', '171', '189'],
    correctAnswer: 2,
    category: 'math'
  },
  {
    id: 8,
    type: 'logic',
    question: 'A rectangle has a perimeter of 24 cm. If its length is twice its width, what is its area?',
    options: ['16 cm²', '32 cm²', '48 cm²', '64 cm²'],
    correctAnswer: 1,
    category: 'math'
  },
  {
    id: 9,
    type: 'logic',
    question: 'A train travels 300 km in 4 hours. If it increases speed by 25%, how long will it take to travel the same distance?',
    options: ['2 hours', '2.5 hours', '3 hours', '3.2 hours'],
    correctAnswer: 3,
    category: 'math'
  },
  {
    id: 10,
    type: 'logic',
    question: 'In a sequence, each number is the sum of the previous two numbers, starting with 3 and 5. What is the 10th number?',
    options: ['89', '144', '233', '377'],
    correctAnswer: 2,
    category: 'math'
  },

  // Spatial Domain Questions (5 questions)
  {
    id: 11,
    type: 'logic',
    question: 'A cube has 6 faces. If you paint the entire cube and then cut it into 27 smaller equal cubes (3x3x3), how many of the smaller cubes have exactly 2 faces painted?',
    options: ['6', '12', '18', '24'],
    correctAnswer: 1,
    category: 'spatial'
  },
  {
    id: 12,
    type: 'logic',
    question: 'If you fold a square piece of paper in half twice, then cut a small triangle from the corner, and unfold it, how many triangles will you see?',
    options: ['2', '4', '8', '16'],
    correctAnswer: 1,
    category: 'spatial'
  },
  {
    id: 13,
    type: 'logic',
    question: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
    options: ['0°', '7.5°', '15°', '22.5°'],
    correctAnswer: 1,
    category: 'spatial'
  },
  {
    id: 14,
    type: 'logic',
    question: 'If you rotate the letter "F" 180 degrees and then reflect it horizontally, what letter does it resemble?',
    options: ['L', 'T', 'J', '7'],
    correctAnswer: 0,
    category: 'spatial'
  },
  {
    id: 15,
    type: 'logic',
    question: 'In a certain pattern, if 1=3, 2=3, 3=5, 4=4, 5=4, 6=3, 7=5, 8=5, 9=4, 10=3, then 11=?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 2,
    category: 'spatial'
  }
]

const openQuestions: Question[] = [
  // Verbal Domain Questions
  {
    id: 16,
    type: 'open',
    question: 'Explain the concept of "justice" in detail. How does it differ from "fairness"? Provide examples from law, society, and personal relationships.',
    category: 'verbal'
  },
  {
    id: 17,
    type: 'open',
    question: 'Describe the relationship between language, thought, and culture. How does speaking multiple languages affect cognitive processes and worldview?',
    category: 'verbal'
  },
  {
    id: 18,
    type: 'open',
    question: 'Analyze the statement: "The pen is mightier than the sword." Discuss its historical accuracy, modern relevance, and limitations with specific examples.',
    category: 'verbal'
  },

  // Memory Domain Questions
  {
    id: 19,
    type: 'open',
    question: 'Describe in detail the process of memory formation, storage, and retrieval in the human brain. Include sensory memory, short-term memory, and long-term memory.',
    category: 'memory'
  },
  {
    id: 20,
    type: 'open',
    question: 'Explain how memory can be unreliable. Describe at least five factors that can distort or create false memories, and provide real-world implications.',
    category: 'memory'
  },
  {
    id: 21,
    type: 'open',
    question: 'Design an optimal study system for learning and retaining complex information. Consider timing, repetition, sleep, nutrition, and cognitive techniques.',
    category: 'memory'
  },

  // Creativity Domain Questions
  {
    id: 22,
    type: 'open',
    question: 'If you could invent three new senses for humans, what would they be and how would they enhance our perception of reality?',
    category: 'creativity'
  },
  {
    id: 23,
    type: 'open',
    question: 'Design a completely new form of government that doesn\'t exist today. Explain its structure, decision-making process, and how it addresses current political failures.',
    category: 'creativity'
  },
  {
    id: 24,
    type: 'open',
    question: 'Imagine a world where gravity works differently. Describe how this would affect architecture, transportation, sports, and daily life. Be as creative as possible.',
    category: 'creativity'
  },

  // Additional Mixed Domain Questions for Balance
  {
    id: 25,
    type: 'open',
    question: 'Explain quantum computing in simple terms, and discuss its potential impact on cryptography, medicine, and artificial intelligence.',
    category: 'verbal'
  },
  {
    id: 26,
    type: 'open',
    question: 'If you had to establish a colony on Mars with 1000 people, what would be your governance structure, economic system, and social organization? Justify your choices.',
    category: 'creativity'
  },
  {
    id: 27,
    type: 'open',
    question: 'Describe the architecture of a perfect city that balances efficiency, sustainability, and human happiness. Include specific design principles.',
    category: 'spatial'
  },
  {
    id: 28,
    type: 'open',
    question: 'How would you solve the global food crisis while considering environmental sustainability, economic viability, and cultural preservation?',
    category: 'memory'
  },
  {
    id: 29,
    type: 'open',
    question: 'Design an educational system that maximizes individual potential while ensuring social equity. How would you measure success?',
    category: 'spatial'
  },
  {
    id: 30,
    type: 'open',
    question: 'Explain the concept of artificial general intelligence (AGI) and discuss its potential benefits and existential risks to humanity.',
    category: 'verbal'
  }
]

// Multi-language support
const translations = {
  en: {
    title: 'Swiss Russameekiattisak',
    subtitle: 'IQ Tester',
    profile: {
      title: 'Profile Information',
      description: 'Please provide your information to begin the IQ test',
      name: 'Full Name',
      namePlaceholder: 'Enter your full name',
      gender: 'Gender',
      age: 'Age',
      weight: 'Weight',
      height: 'Height',
      startTest: 'Start IQ Test'
    },
    quiz: {
      question: 'Question',
      logic: 'Logic',
      openEnded: 'Open-ended',
      next: 'Next Question',
      complete: 'Complete Test',
      progress: 'Question {current} of {total}'
    },
    result: {
      title: 'Your IQ Results',
      iqScore: 'IQ Score',
      skills: {
        logic: 'Logic',
        math: 'Math',
        verbal: 'Verbal',
        spatial: 'Spatial',
        memory: 'Memory',
        creativity: 'Creativity'
      },
      viewCertificate: 'View Certificate',
      retakeTest: 'Retake Test'
    },
    certificate: {
      title: 'Certificate of Achievement',
      subtitle: 'This is to certify that',
      achievement: 'has successfully completed the Advanced IQ Test',
      iqScore: 'IQ Score',
      testDate: 'Test Date',
      download: 'Download Certificate (PDF)',
      backToResults: 'Back to Results',
      footer: 'Swiss Russameekiattisak Advanced IQ Testing'
    }
  },
  th: {
    title: 'สวิส รัศมีกิจจาภิรมย์',
    subtitle: 'ทดสอบไอคิว',
    profile: {
      title: 'ข้อมูลส่วนตัว',
      description: 'กรุณากรอกข้อมูลของคุณเพื่อเริ่มการทดสอบไอคิว',
      name: 'ชื่อเต็ม',
      namePlaceholder: 'กรอกชื่อเต็มของคุณ',
      gender: 'เพศ',
      age: 'อายุ',
      weight: 'น้ำหนัก',
      height: 'ส่วนสูง',
      startTest: 'เริ่มทดสอบไอคิว'
    },
    quiz: {
      question: 'คำถาม',
      logic: 'ตรรกะ',
      openEnded: 'เปิด',
      next: 'คำถามถัดไป',
      complete: 'ทำการทดสอบเสร็จสิ้น',
      progress: 'คำถามที่ {current} จาก {total}'
    },
    result: {
      title: 'ผลลัพธ์ไอคิวของคุณ',
      iqScore: 'คะแนนไอคิว',
      skills: {
        logic: 'ตรรกะ',
        math: 'คณิตศาสตร์',
        verbal: 'ภาษา',
        spatial: 'พื้นที่',
        memory: 'ความจำ',
        creativity: 'ความคิดสร้างสรรค์'
      },
      viewCertificate: 'ดูใบประกาศ',
      retakeTest: 'ทำแบบทดสอบอีกครั้ง'
    },
    certificate: {
      title: 'ใบประกาศนียบัตร',
      subtitle: 'นี่รับรองว่า',
      achievement: 'ได้ผ่านการทดสอบไอคิวขั้นสูงเรียบร้อยแล้ว',
      iqScore: 'คะแนนไอคิว',
      testDate: 'วันที่ทดสอบ',
      download: 'ดาวน์โหลดใบประกาศ (PDF)',
      backToResults: 'กลับไปยังผลลัพธ์',
      footer: 'ศูนย์ทดสอบไอคิวขั้นสูง สวิส รัศมีกิจจาภิรมย์'
    }
  },
  zh: {
    title: '瑞士拉沙米基蒂萨克',
    subtitle: '智商测试',
    profile: {
      title: '个人信息',
      description: '请提供您的信息以开始智商测试',
      name: '全名',
      namePlaceholder: '请输入您的全名',
      gender: '性别',
      age: '年龄',
      weight: '体重',
      height: '身高',
      startTest: '开始智商测试'
    },
    quiz: {
      question: '问题',
      logic: '逻辑',
      openEnded: '开放',
      next: '下一题',
      complete: '完成测试',
      progress: '第 {current} 题，共 {total} 题'
    },
    result: {
      title: '您的智商结果',
      iqScore: '智商分数',
      skills: {
        logic: '逻辑',
        math: '数学',
        verbal: '语言',
        spatial: '空间',
        memory: '记忆',
        creativity: '创造力'
      },
      viewCertificate: '查看证书',
      retakeTest: '重新测试'
    },
    certificate: {
      title: '成就证书',
      subtitle: '特此证明',
      achievement: '已成功完成高级智商测试',
      iqScore: '智商分数',
      testDate: '测试日期',
      download: '下载证书 (PDF)',
      backToResults: '返回结果',
      footer: '瑞士拉沙米基蒂萨克高级智商测试中心'
    }
  },
  ja: {
    title: 'スイス・ラサミーキティサック',
    subtitle: 'IQテスター',
    profile: {
      title: 'プロフィール情報',
      description: 'IQテストを開始するために情報を提供してください',
      name: '氏名',
      namePlaceholder: '氏名を入力してください',
      gender: '性別',
      age: '年齢',
      weight: '体重',
      height: '身長',
      startTest: 'IQテストを開始'
    },
    quiz: {
      question: '質問',
      logic: '論理',
      openEnded: '記述',
      next: '次の質問',
      complete: 'テスト完了',
      progress: '質問 {current}/{total}'
    },
    result: {
      title: 'あなたのIQ結果',
      iqScore: 'IQスコア',
      skills: {
        logic: '論理',
        math: '数学',
        verbal: '言語',
        spatial: '空間',
        memory: '記憶',
        creativity: '創造性'
      },
      viewCertificate: '証明書を表示',
      retakeTest: '再テスト'
    },
    certificate: {
      title: '達成証明書',
      subtitle: 'これを証明します',
      achievement: 'は高度なIQテストを無事完了しました',
      iqScore: 'IQスコア',
      testDate: 'テスト日',
      download: '証明書をダウンロード (PDF)',
      backToResults: '結果に戻る',
      footer: 'スイス・ラサミーキティサック高度IQテストセンター'
    }
  }
}

export default function IQTester() {
  const [currentSection, setCurrentSection] = useState<'profile' | 'quiz' | 'result' | 'certificate'>('profile')
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    weight: 70,
    height: 170,
    gender: 'male'
  })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [honeypotValue, setHoneypotValue] = useState('')
  const [language, setLanguage] = useState<'en' | 'th' | 'zh' | 'ja'>('en')
  const certificateRef = useRef<HTMLDivElement>(null)

  const t = translations[language]

  const allQuestions = [...logicQuestions, ...openQuestions]
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100

  const calculateIQ = (answers: any[], userProfile: UserProfile): QuizResult => {
    let logicScore = 0
    let mathScore = 0
    let verbalScore = 0
    let spatialScore = 0
    let memoryScore = 0
    let creativityScore = 0

    // Count questions in each category for proper scoring
    const logicQuestionsCount = logicQuestions.filter(q => q.category === 'logic').length
    const mathQuestionsCount = logicQuestions.filter(q => q.category === 'math').length
    const spatialQuestionsCount = logicQuestions.filter(q => q.category === 'spatial').length

    // Calculate scores from logic questions (15 questions total)
    logicQuestions.forEach((question, index) => {
      const userAnswer = answers[index]
      if (userAnswer !== undefined && question.correctAnswer !== undefined) {
        if (userAnswer === question.correctAnswer) {
          // Add points to specific category based on question count
          switch (question.category) {
            case 'logic':
              logicScore += (100 / logicQuestionsCount) // 100/5 = 20 points per logic question
              break
            case 'math':
              mathScore += (100 / mathQuestionsCount) // 100/5 = 20 points per math question
              break
            case 'spatial':
              spatialScore += (100 / spatialQuestionsCount) // 100/5 = 20 points per spatial question
              break
          }
        }
      }
    })

    // Count open questions in each category
    const verbalQuestionsCount = openQuestions.filter(q => q.category === 'verbal').length
    const memoryQuestionsCount = openQuestions.filter(q => q.category === 'memory').length
    const creativityQuestionsCount = openQuestions.filter(q => q.category === 'creativity').length
    const spatialOpenQuestionsCount = openQuestions.filter(q => q.category === 'spatial').length

    // Calculate scores from open-ended questions (15 questions total)
    openQuestions.forEach((question, index) => {
      const userAnswer = answers[logicQuestions.length + index]
      if (userAnswer && userAnswer.length > 50) {
        // Base score for length (minimum threshold)
        let scoreBonus = Math.min(userAnswer.length / 25, 8)
        
        // Advanced scoring based on content quality indicators
        const complexityWords = ['because', 'therefore', 'however', 'although', 'furthermore', 'consequently', 'moreover', 'nevertheless', 'whereas', 'thus', 'hence']
        const complexityCount = complexityWords.reduce((count, word) => 
          count + (userAnswer.toLowerCase().split(word).length - 1), 0
        )
        scoreBonus += complexityCount * 1.5
        
        // Bonus for structured thinking
        if (userAnswer.match(/\d+\./) || userAnswer.match(/first|second|third|finally|in conclusion/i)) {
          scoreBonus += 2
        }
        
        // Bonus for technical and analytical vocabulary
        const technicalWords = ['system', 'process', 'method', 'analysis', 'strategy', 'framework', 'implementation', 'optimization', 'algorithm', 'structure', 'function', 'mechanism']
        const technicalCount = technicalWords.reduce((count, word) => 
          count + (userAnswer.toLowerCase().split(word).length - 1), 0
        )
        scoreBonus += technicalCount * 1
        
        // Bonus for comprehensive thinking (multiple perspectives)
        const perspectiveWords = ['however', 'alternatively', 'conversely', 'nevertheless', 'on the other hand', 'in contrast', 'similarly', 'additionally']
        const perspectiveCount = perspectiveWords.reduce((count, word) => 
          count + (userAnswer.toLowerCase().split(word).length - 1), 0
        )
        scoreBonus += perspectiveCount * 2
        
        // Bonus for specific domain-related vocabulary
        let domainBonus = 0
        let maxScore = 0
        switch (question.category) {
          case 'verbal':
            const verbalWords = ['language', 'communication', 'meaning', 'interpretation', 'expression', 'discourse', 'narrative', 'semantic', 'syntax']
            domainBonus = verbalWords.reduce((count, word) => 
              count + (userAnswer.toLowerCase().split(word).length - 1), 0
            ) * 1.5
            maxScore = (100 / verbalQuestionsCount) // 100/6 ≈ 16.67 points per verbal question
            break
          case 'memory':
            const memoryWords = ['remember', 'recall', 'retain', 'storage', 'retrieval', 'encoding', 'consolidation', 'forgetting', 'recognition']
            domainBonus = memoryWords.reduce((count, word) => 
              count + (userAnswer.toLowerCase().split(word).length - 1), 0
            ) * 1.5
            maxScore = (100 / memoryQuestionsCount) // 100/3 ≈ 33.33 points per memory question
            break
          case 'creativity':
            const creativeWords = ['imagine', 'innovate', 'create', 'design', 'invent', 'novel', 'original', 'unique', 'transform', 'envision']
            domainBonus = creativeWords.reduce((count, word) => 
              count + (userAnswer.toLowerCase().split(word).length - 1), 0
            ) * 1.5
            maxScore = (100 / creativityQuestionsCount) // 100/4 = 25 points per creativity question
            break
          case 'spatial':
            const spatialWords = ['space', 'dimension', 'geometry', 'structure', 'layout', 'position', 'orientation', 'perspective', 'three-dimensional']
            domainBonus = spatialWords.reduce((count, word) => 
              count + (userAnswer.toLowerCase().split(word).length - 1), 0
            ) * 1.5
            maxScore = (100 / spatialOpenQuestionsCount) // 100/2 = 50 points per spatial question
            break
        }
        scoreBonus += domainBonus
        
        // Cap at maximum score per question
        scoreBonus = Math.min(scoreBonus, maxScore)
        
        // Add to appropriate category
        switch (question.category) {
          case 'verbal':
            verbalScore += scoreBonus
            break
          case 'memory':
            memoryScore += scoreBonus
            break
          case 'creativity':
            creativityScore += scoreBonus
            break
          case 'spatial':
            spatialScore += scoreBonus
            break
        }
      }
    })

    // Age adjustment (based on real IQ testing norms)
    let ageFactor = 1.0
    if (userProfile.age < 16) ageFactor = 0.95
    else if (userProfile.age < 25) ageFactor = 1.02
    else if (userProfile.age > 65) ageFactor = 0.98

    // Gender adjustment (minimal, based on statistical norms)
    const genderFactor = userProfile.gender === 'male' ? 1.01 : 0.99

    // Calculate domain scores (normalized to 0-100)
    const normalizedLogic = Math.min(100, logicScore)
    const normalizedMath = Math.min(100, mathScore)
    const normalizedVerbal = Math.min(100, verbalScore)
    const normalizedSpatial = Math.min(100, spatialScore)
    const normalizedMemory = Math.min(100, memoryScore)
    const normalizedCreativity = Math.min(100, creativityScore)
    
    // Calculate overall IQ using balanced approach
    const domainAverage = (normalizedLogic + normalizedMath + normalizedVerbal + normalizedSpatial + normalizedMemory + normalizedCreativity) / 6
    
    // Convert to IQ scale (mean 100, SD 15), with realistic range
    let baseIQ = 70 + (domainAverage * 0.9) // Scale to 70-160 range
    
    // Apply adjustments
    const adjustedIQ = Math.round(baseIQ * ageFactor * genderFactor)
    
    // Final score clamping to realistic IQ range
    const finalScore = Math.max(70, Math.min(160, adjustedIQ))

    return {
      iqScore: finalScore,
      skills: {
        logic: Math.round(normalizedLogic),
        math: Math.round(normalizedMath),
        verbal: Math.round(normalizedVerbal),
        spatial: Math.round(normalizedSpatial),
        memory: Math.round(normalizedMemory),
        creativity: Math.round(normalizedCreativity)
      },
      answers
    }
  }

  const handleProfileSubmit = () => {
    if (!profile.name.trim()) {
      alert('Please enter your name')
      return
    }
    if (honeypotValue) {
      // Bot detected - don't proceed
      return
    }
    setCurrentSection('quiz')
  }

  const handleAnswerSubmit = () => {
    const newAnswers = [...answers, currentAnswer]
    setAnswers(newAnswers)
    setCurrentAnswer('')

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Quiz completed
      const result = calculateIQ(newAnswers, profile)
      setQuizResult(result)
      setCurrentSection('result')
    }
  }

  const downloadCertificate = async () => {
    if (!certificateRef.current || !quizResult) return

    try {
      // Create a new PDF with proper dimensions
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })
      
      // Set background
      pdf.setFillColor(26, 26, 46)
      pdf.rect(0, 0, 297, 210, 'F')
      
      // Add gradient effect (simulated with rectangles)
      for (let i = 0; i < 10; i++) {
        const alpha = 0.05 * (10 - i)
        pdf.setFillColor(147, 51, 234, alpha)
        pdf.rect(i * 2, i * 1.5, 297 - i * 4, 210 - i * 3, 'F')
      }
      
      // Title
      pdf.setFontSize(28)
      pdf.setTextColor(255, 215, 0) // Gold color
      pdf.setFont('helvetica', 'bold')
      pdf.text('Certificate of Achievement', 148.5, 40, { align: 'center' })
      
      // Subtitle
      pdf.setFontSize(16)
      pdf.setTextColor(200, 200, 200)
      pdf.setFont('helvetica', 'normal')
      pdf.text('This is to certify that', 148.5, 60, { align: 'center' })
      
      // Name
      pdf.setFontSize(24)
      pdf.setTextColor(255, 255, 255)
      pdf.setFont('helvetica', 'bold')
      pdf.text(profile.name, 148.5, 80, { align: 'center' })
      
      // Achievement text
      pdf.setFontSize(14)
      pdf.setTextColor(200, 200, 200)
      pdf.setFont('helvetica', 'normal')
      pdf.text('has successfully completed the Advanced IQ Test', 148.5, 100, { align: 'center' })
      
      // IQ Score Box
      pdf.setFillColor(147, 51, 234, 0.3)
      pdf.rect(98.5, 110, 100, 40, 'F')
      pdf.setDrawColor(147, 51, 234)
      pdf.rect(98.5, 110, 100, 40)
      
      pdf.setFontSize(20)
      pdf.setTextColor(255, 255, 255)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${quizResult.iqScore}`, 148.5, 135, { align: 'center' })
      
      pdf.setFontSize(12)
      pdf.text('IQ Score', 148.5, 145, { align: 'center' })
      
      // Date
      pdf.setFontSize(12)
      pdf.setTextColor(200, 200, 200)
      pdf.setFont('helvetica', 'normal')
      const testDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      pdf.text(`Test Date: ${testDate}`, 148.5, 170, { align: 'center' })
      
      // Footer
      pdf.setFontSize(10)
      pdf.setTextColor(150, 150, 150)
      pdf.text('Swiss Russameekiattisak Advanced IQ Testing', 148.5, 190, { align: 'center' })
      
      // Save the PDF
      pdf.save(`IQ_Certificate_${profile.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Fallback: try the canvas method
      try {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          backgroundColor: '#1a1a2e'
        })
        
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('l', 'mm', 'a4')
        
        const imgWidth = 297
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        pdf.save(`IQ_Certificate_${profile.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)
      } catch (fallbackError) {
        console.error('Fallback PDF generation also failed:', fallbackError)
        alert('Certificate download failed. Please try again.')
      }
    }
  }

  const currentQuestion = allQuestions[currentQuestionIndex]

  const radarData = quizResult ? {
    labels: ['Logic', 'Math', 'Verbal', 'Spatial', 'Memory', 'Creativity'],
    datasets: [
      {
        label: 'Skill Levels',
        data: [
          quizResult.skills.logic,
          quizResult.skills.math,
          quizResult.skills.verbal,
          quizResult.skills.spatial,
          quizResult.skills.memory,
          quizResult.skills.creativity
        ],
        backgroundColor: 'rgba(147, 51, 234, 0.2)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(147, 51, 234, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(147, 51, 234, 1)'
      }
    ]
  } : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          <Select value={language} onValueChange={(value: 'en' | 'th' | 'zh' | 'ja') => setLanguage(value)}>
            <SelectTrigger className="w-32 bg-slate-800/50 border-purple-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-purple-500/30">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="th">ไทย</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <Brain className="w-10 h-10 text-pink-400" />
          </div>
          <p className="text-xl text-purple-200">{t.subtitle}</p>
        </div>

        {/* Profile Section */}
        {currentSection === 'profile' && (
          <Card className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-lg border-purple-500/30 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-purple-300 flex items-center justify-center gap-2">
                <User className="w-6 h-6" />
                {t.profile.title}
              </CardTitle>
              <CardDescription className="text-purple-200">
                {t.profile.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-purple-200">{t.profile.name}</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder={t.profile.namePlaceholder}
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-purple-200">{t.profile.gender}</Label>
                <Select value={profile.gender} onValueChange={(value) => setProfile({...profile, gender: value})}>
                  <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-purple-200">{t.profile.age}: {profile.age} {language === 'en' ? 'years' : language === 'th' ? 'ปี' : language === 'zh' ? '岁' : '歳'}</Label>
                <Slider
                  value={[profile.age]}
                  onValueChange={(value) => setProfile({...profile, age: value[0]})}
                  max={140}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-purple-200">{t.profile.weight}: {profile.weight} kg</Label>
                <Slider
                  value={[profile.weight]}
                  onValueChange={(value) => setProfile({...profile, weight: value[0]})}
                  max={250}
                  min={3}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-purple-200">{t.profile.height}: {profile.height} cm</Label>
                <Slider
                  value={[profile.height]}
                  onValueChange={(value) => setProfile({...profile, height: value[0]})}
                  max={250}
                  min={30}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Honeypot field for bot protection */}
              <div className="hidden">
                <Label htmlFor="honeypot">Leave this field empty</Label>
                <Input
                  id="honeypot"
                  value={honeypotValue}
                  onChange={(e) => setHoneypotValue(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <Button 
                onClick={handleProfileSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                {t.profile.startTest}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quiz Section */}
        {currentSection === 'quiz' && currentQuestion && (
          <Card className="max-w-3xl mx-auto bg-slate-800/50 backdrop-blur-lg border-purple-500/30 shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="text-purple-300 border-purple-500/30">
                  {t.quiz.progress.replace('{current}', String(currentQuestionIndex + 1)).replace('{total}', String(allQuestions.length))}
                </Badge>
                <Badge variant="outline" className="text-purple-300 border-purple-500/30">
                  {currentQuestion.type === 'logic' ? t.quiz.logic : t.quiz.openEnded}
                </Badge>
              </div>
              <Progress value={progress} className="w-full h-2 bg-slate-700" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg text-purple-100 leading-relaxed">
                {currentQuestion.question}
              </div>

              {currentQuestion.type === 'logic' && currentQuestion.options ? (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={currentAnswer === index.toString() ? "default" : "outline"}
                      onClick={() => setCurrentAnswer(index.toString())}
                      className={`w-full text-left justify-start p-4 h-auto ${
                        currentAnswer === index.toString()
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'bg-slate-700/50 border-purple-500/30 hover:bg-slate-700 text-purple-200'
                      }`}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              ) : (
                <Textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder={language === 'en' ? 'Type your answer here...' : language === 'th' ? 'พิมพ์คำตอบของคุณที่นี่...' : language === 'zh' ? '在此输入您的答案...' : 'ここに回答を入力...'}
                  className="min-h-[120px] bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300/50"
                />
              )}

              <Button
                onClick={handleAnswerSubmit}
                disabled={!currentAnswer.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                {currentQuestionIndex < allQuestions.length - 1 ? t.quiz.next : t.quiz.complete}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Result Section */}
        {currentSection === 'result' && quizResult && (
          <div className="space-y-8">
            <Card className="max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-lg border-purple-500/30 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-purple-300 flex items-center justify-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  {t.result.title}
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="text-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {quizResult.iqScore}
                  </div>
                  <p className="text-xl text-purple-200">{t.result.iqScore}</p>
                </div>

                <div className="h-80">
                  {radarData && <CustomRadarChart data={radarData} />}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-300">{quizResult.skills.logic}</div>
                    <div className="text-sm text-purple-200">{t.result.skills.logic}</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-300">{quizResult.skills.math}</div>
                    <div className="text-sm text-purple-200">{t.result.skills.math}</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-300">{quizResult.skills.verbal}</div>
                    <div className="text-sm text-purple-200">{t.result.skills.verbal}</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-300">{quizResult.skills.spatial}</div>
                    <div className="text-sm text-purple-200">{t.result.skills.spatial}</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-300">{quizResult.skills.memory}</div>
                    <div className="text-sm text-purple-200">{t.result.skills.memory}</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-300">{quizResult.skills.creativity}</div>
                    <div className="text-sm text-purple-200">{t.result.skills.creativity}</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setCurrentSection('certificate')}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {t.result.viewCertificate}
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentSection('profile')
                      setAnswers([])
                      setCurrentQuestionIndex(0)
                      setQuizResult(null)
                      setCurrentAnswer('')
                    }}
                    variant="outline"
                    className="flex-1 border-purple-500/30 text-purple-200 hover:bg-slate-700/50"
                  >
                    {t.result.retakeTest}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Certificate Section */}
        {currentSection === 'certificate' && quizResult && (
          <div className="space-y-8">
            <Card className="max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-lg border-purple-500/30 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-purple-300">{t.certificate.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div 
                  ref={certificateRef}
                  className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 rounded-lg border-2 border-purple-500/30 shadow-2xl"
                >
                  <div className="text-center space-y-6">
                    <div className="flex items-center justify-center gap-3">
                      <Trophy className="w-12 h-12 text-yellow-400" />
                      <h2 className="text-4xl font-bold text-yellow-400">{t.certificate.title}</h2>
                      <Trophy className="w-12 h-12 text-yellow-400" />
                    </div>
                    
                    <div className="text-purple-200">
                      <p className="text-lg mb-2">{t.certificate.subtitle}</p>
                      <p className="text-3xl font-bold text-white mb-2">{profile.name}</p>
                      <p className="text-lg">{t.certificate.achievement}</p>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-lg border border-purple-500/30">
                      <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        {quizResult.iqScore}
                      </div>
                      <p className="text-xl text-purple-200">{t.certificate.iqScore}</p>
                    </div>

                    <div className="text-purple-200">
                      <p className="text-lg">{t.certificate.testDate}: {new Date().toLocaleDateString(language === 'en' ? 'en-US' : language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'ja-JP', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-purple-300">
                      <Brain className="w-6 h-6" />
                      <span>{t.certificate.footer}</span>
                      <Brain className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={downloadCertificate}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {t.certificate.download}
                  </Button>
                  <Button
                    onClick={() => setCurrentSection('result')}
                    variant="outline"
                    className="border-purple-500/30 text-purple-200 hover:bg-slate-700/50"
                  >
                    {t.certificate.backToResults}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}