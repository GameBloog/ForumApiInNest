import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { CreateQuestionUseCase } from "./create-question"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repositories"
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository"

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let sut: CreateQuestionUseCase

describe("Create Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    )
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository)
  })

  it("should be able to create a question", async () => {
    const result = await sut.execute({
      authorId: "1",
      title: "Nova pergunta",
      content: "Conteúdo da pergunta",
      attachmentIds: ["1", "2"],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionRepository.items[0]).toEqual(result.value?.question)
    expect(
      inMemoryQuestionRepository.items[0].attachment.currentItems
    ).toHaveLength(2)
    expect(inMemoryQuestionRepository.items[0].attachment.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
        expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
      ]
    )
  })
})
