import { QuestionAttachment } from "../../enterprise/entities/question-attachment"

export interface QuestionsAttachmentRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
  deleteManyByQuestionId(questionId: string): Promise<void>
}
