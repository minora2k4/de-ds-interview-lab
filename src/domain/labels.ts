import type {
  Difficulty,
  DomainId,
  GradeStatus,
  InterviewType,
  Level,
  QuestionType,
  QuizField,
  Skill,
} from './types'

export const DIFFICULTIES: Difficulty[] = ['co-ban', 'trung-binh', 'nang-cao', 'chuyen-sau']
export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  'co-ban': 'Cơ bản',
  'trung-binh': 'Trung bình',
  'nang-cao': 'Nâng cao',
  'chuyen-sau': 'Chuyên sâu',
}

export const QUESTION_TYPES: QuestionType[] = [
  'single',
  'multiple',
  'true-false',
  'fill-blank',
  'scenario',
  'short-answer',
]
export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  single: 'Trắc nghiệm một đáp án',
  multiple: 'Trắc nghiệm nhiều đáp án',
  'true-false': 'Đúng / Sai',
  'fill-blank': 'Điền khuyết',
  scenario: 'Câu hỏi tình huống',
  'short-answer': 'Câu hỏi trả lời ngắn',
}

export const QUIZ_FIELDS: QuizField[] = ['de', 'ds', 'bigdata']
export const QUIZ_FIELD_LABEL: Record<QuizField, string> = {
  de: 'Data Engineering',
  ds: 'Data Science',
  bigdata: 'Big Data',
}

export const DOMAIN_LABEL: Record<DomainId, string> = {
  de: 'Data Engineering',
  ds: 'Data Science',
}

export const SKILL_LABEL: Record<Skill, string> = {
  essence: 'Hiểu bản chất',
  mechanism: 'Cơ chế hoạt động',
  comparison: 'So sánh công nghệ',
  tradeoff: 'Ưu nhược điểm',
  choice: 'Lựa chọn giải pháp',
  'problem-solving': 'Giải quyết vấn đề',
  design: 'Thiết kế kiến trúc',
  recall: 'Ghi nhớ định nghĩa',
}

export const INTERVIEW_TYPES: InterviewType[] = ['de', 'ds', 'bigdata', 'system-design']
export const INTERVIEW_TYPE_LABEL: Record<InterviewType, string> = {
  de: 'Data Engineer Interview',
  ds: 'Data Scientist Interview',
  bigdata: 'Big Data Interview',
  'system-design': 'System Design Interview',
}
export const INTERVIEW_TYPE_DESCRIPTION: Record<InterviewType, string> = {
  de: 'Database, Data Warehouse, Data Pipeline và kiến trúc dữ liệu.',
  ds: 'Thống kê, phân tích dữ liệu, Feature Engineering và đánh giá mô hình.',
  bigdata: 'Hadoop, Spark, Kafka và các hệ thống phân tán.',
  'system-design': 'Thiết kế hệ thống dữ liệu từ yêu cầu đến đánh đổi.',
}

export const LEVELS: Level[] = ['fresher', 'junior', 'middle', 'senior']
export const LEVEL_LABEL: Record<Level, string> = {
  fresher: 'Fresher',
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
}

export const GRADE_STATUS_LABEL: Record<GradeStatus, string> = {
  correct: 'Đúng',
  partial: 'Đúng một phần',
  wrong: 'Sai',
  skipped: 'Bỏ qua',
}
