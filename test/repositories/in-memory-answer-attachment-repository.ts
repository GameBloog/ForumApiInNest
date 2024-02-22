import { PaginationParams } from "@/core/repositorys/pagination-params"
import { AnswersAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachmentIds-repository"
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment"

export class InMemoryAnswerAttachmentRepository
  implements AnswersAttachmentRepository
{
  public items: AnswerAttachment[] = []

  async createMany(attachment: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachment)
  }

  async deleteMany(attachment: AnswerAttachment[]): Promise<void> {
    const answerAttachment = this.items.filter((item) => {
      return !attachment.some((attachment) => attachment.equals(item))
    })

    this.items = answerAttachment
  }

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
