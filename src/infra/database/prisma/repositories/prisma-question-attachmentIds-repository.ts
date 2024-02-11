import { QuestionsAttachmentRepository } from "@/domain/forum/application/repositories/question-attachmentIds-repository"
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PrismaQuestionsAttachmentsRepository
  implements QuestionsAttachmentRepository
{
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    throw new Error("Method not implemented.")
  }
  deleteManyByQuestionId(questionId: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
