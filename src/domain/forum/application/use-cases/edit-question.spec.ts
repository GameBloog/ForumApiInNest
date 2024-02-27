import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repositories"
import { makeQuestion } from "test/factories/make-question"
import { EditQuestionUseCase } from "./edit-question"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository"
import { makeQuestionAttachment } from "test/factories/make-question-attachment"
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repostirory"
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repostirory"

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: EditQuestionUseCase

describe("Edit Question", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    )
    sut = new EditQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionAttachmentRepository
    )
  })

  it("should be able to edit a question", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("question-1")
    )

    await inMemoryQuestionRepository.create(newQuestion)

    inMemoryQuestionAttachmentRepository.items.push(
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
      questionId: newQuestion.id.toValue(),
      authorId: "author-1",
      title: "Pergunta teste",
      content: "Conteúdo teste",
      attachmentIds: ["1", "3"],
    })

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: "Pergunta teste",
      content: "Conteúdo teste",
    })
    expect(
      inMemoryQuestionRepository.items[0].attachment.currentItems
    ).toHaveLength(2)
    expect(inMemoryQuestionRepository.items[0].attachment.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
        expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
      ]
    )
  })

  it("should not be able to edit a question from another user", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("question-1")
    )

    inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "author-2",
      title: "Pergunta teste",
      content: "Conteúdo teste",
      attachmentIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it("should sync new and removed attachments when editing a question", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("question-1")
    )

    await inMemoryQuestionRepository.create(newQuestion)

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("2"),
      })
    )

    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "author-1",
      title: "Pergunta teste",
      content: "Conteúdo teste",
      attachmentIds: ["1", "3"],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(2)
    expect(inMemoryQuestionAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID("1"),
        }),

        expect.objectContaining({
          attachmentId: new UniqueEntityID("3"),
        }),
      ])
    )
  })
})
