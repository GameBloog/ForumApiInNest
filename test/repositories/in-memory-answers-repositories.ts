import { DomainEvents } from "@/core/events/domain-events"
import { PaginationParams } from "@/core/repositorys/pagination-params"
import { AnswersAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachmentIds-repository"
import { AsnwerRepository } from "@/domain/forum/application/repositories/answers-repository"
import { Answer } from "@/domain/forum/enterprise/entities/answer"

export class InMemoryAnswerRepository implements AsnwerRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswersAttachmentRepository
  ) {}

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async create(answer: Answer) {
    this.items.push(answer)

    await this.answerAttachmentsRepository.createMany(
      answer.attachment.getItems()
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items[itemIndex] = answer

    await this.answerAttachmentsRepository.createMany(
      answer.attachment.getNewItems()
    )

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachment.getRemovedItems()
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items.splice(itemIndex, 1)

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }
}
