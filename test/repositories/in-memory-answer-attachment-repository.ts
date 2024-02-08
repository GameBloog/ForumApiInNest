import { PaginationParams } from "@/core/repositorys/pagination-params"
import { AnswersAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachmentIds-repository"
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment"

export class InMemoryAnswerAttachmentRepository
  implements AnswersAttachmentRepository
{
  public items: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string) {
    const answerAttachment = this.items.filter(
      (item) => item.answerId.toString() === answerId
    )

    return answerAttachment
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId
    )

    this.items = answerAttachments
  }
}
