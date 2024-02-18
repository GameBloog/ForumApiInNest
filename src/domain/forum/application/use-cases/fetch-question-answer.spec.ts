import { InMemoryAnswerRepository } from "test/repositories/in-memory-answers-repositories"
import { makeQuestion } from "test/factories/make-question"
import { FetchQuestionAnswersUseCase } from "./fetch-question-answer"
import { makeAnswer } from "test/factories/make-answer"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository"

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryQuestionRepository: InMemoryAnswerRepository
let sut: FetchQuestionAnswersUseCase

describe("Fetch Questions Answers", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryQuestionRepository)
  })

  it("should be able to fetch question answers", async () => {
    await inMemoryQuestionRepository.create(makeAnswer({
      questionId: new UniqueEntityID('question-1')
    }))
    await inMemoryQuestionRepository.create(makeAnswer({
      questionId: new UniqueEntityID('question-1')
    }))
    await inMemoryQuestionRepository.create(makeAnswer({
      questionId: new UniqueEntityID('question-1')
    }))

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.answers).toHaveLength(3)
  })

  it("should be able to fetch paginated questions asnwers", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID("question-1"),
        })
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.answers).toHaveLength(2)
  })
})
