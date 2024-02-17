import { QuestionAttachment } from "../../enterprise/entities/question-attachment"

export abstract class QuestionsAttachmentRepository {
  abstract findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]>
  abstract deleteManyByQuestionId(questionId: string): Promise<void>
}
