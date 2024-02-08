import { PaginationParams } from "@/core/repositorys/pagination-params"
import { QuestionsAttachmentRepository } from "@/domain/forum/application/repositories/question-attachmentIds-repository"
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment"

export class InMemoryQuestionAttachmentRepository
  implements QuestionsAttachmentRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionAttachment = this.items.filter(
      (item) => item.questionId.toString() === questionId
    )

    return questionAttachment
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )

    this.items = questionAttachments
  }
}
