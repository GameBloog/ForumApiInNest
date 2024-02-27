import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repositories"
import { makeQuestion } from "test/factories/make-question"
import { DeleteQuestionUseCase } from "./delete-question"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository"
import { makeQuestionAttachment } from "test/factories/make-question-attachment"
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repostirory"
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repostirory"

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let sut: DeleteQuestionUseCase

describe("Delete Question", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    )
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)
  })

  it("should be able to delete a question", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("question-1")
    )

    inMemoryQuestionRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("2"),
      })
    )

    await sut.execute({
      questionId: "question-1",
      authorId: "author-1",
    })

    expect(inMemoryQuestionRepository.items).toHaveLength(0)
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a question from another user", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("question-1")
    )

    inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: "question-1",
      authorId: "author-2",
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
