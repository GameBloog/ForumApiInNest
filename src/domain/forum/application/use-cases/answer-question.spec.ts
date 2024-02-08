import { InMemoryAnswerRepository } from "test/repositories/in-memory-answers-repositories"
import { AnswerQuestionUseCase } from "./answer-question"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository"

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: AnswerQuestionUseCase

describe("Create Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository= new InMemoryAnswerAttachmentRepository
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    )
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)
  })

  it("should be able to create an answer", async () => {
    const result = await sut.execute({
      questionId: "1",
      instructorId: "2",
      content: "Conteúdo da resposta",
      attachmentIds: ["1", "2"],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerRepository.items[0]).toEqual(result.value?.answer)

    expect(
      inMemoryAnswerRepository.items[0].attachment.currentItems
    ).toHaveLength(2)
    expect(inMemoryAnswerRepository.items[0].attachment.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
    ])
  })
})
