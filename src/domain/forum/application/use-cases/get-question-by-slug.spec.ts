import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repositories"
import { GetQuestionBySlugUseCase } from "./get-question-by-slug"
import { makeQuestion } from "test/factories/make-question"
import { Slug } from "../../enterprise/entities/value-objects/slug"
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository"

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe("Get Question By Slug", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
  })

  it("should be able to get a question by slug", async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create("example-question"),
    })

    inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      slug: "example-question",
    })

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
      }),
    })
  })
})
