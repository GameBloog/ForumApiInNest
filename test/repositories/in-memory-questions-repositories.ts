import { DomainEvents } from "@/core/events/domain-events"
import { PaginationParams } from "@/core/repositorys/pagination-params"
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository"
import { Question } from "@/domain/forum/enterprise/entities/question"
import { InMemoryQuestionAttachmentRepository } from "./in-memory-question-attachment-repository"
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repostirory"
import { InMemoryStudentsRepository } from "./in-memory-students-repostirory"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/questions-details"

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionsAttachmentRepository: InMemoryQuestionAttachmentRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsrepository: InMemoryStudentsRepository
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

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentsrepository.items.find((student) => {
      return student.id.equals(question.authorId)
    })

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exist.`
      )
    }

    const questionAttachments = this.questionsAttachmentRepository.items.filter(
      (questionAttachment) => {
        return questionAttachment.questionId.equals(question.id)
      }
    )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId)
      })

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist.`
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatdeAt,
    })
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
