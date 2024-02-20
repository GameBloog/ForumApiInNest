import { DomainEvents } from "@/core/events/domain-events"
import { PaginationParams } from "@/core/repositorys/pagination-params"
import { QuestionsAttachmentRepository } from "@/domain/forum/application/repositories/question-attachmentIds-repository"
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository"
import { Question } from "@/domain/forum/enterprise/entities/question"

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionsAttachmentRepository: QuestionsAttachmentRepository
  ) {}

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async create(question: Question) {
    this.items.push(question)

    await this.questionsAttachmentRepository.createMany(
      question.attachment.getItems()
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question

    await this.questionsAttachmentRepository.createMany(
      question.attachment.getNewItems()
    )

    await this.questionsAttachmentRepository.deleteMany(
      question.attachment.getRemovedItems()
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)

    this.questionsAttachmentRepository.deleteManyByQuestionId(
      question.id.toString()
    )
  }
}
