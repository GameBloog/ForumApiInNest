import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository"
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments"
import { makeAnswerComment } from "test/factories/make-answer-comment"

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentRepository
let sut: FetchAnswerCommentsUseCase

describe("Fetch Answer Comment", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it("should be able to fetch answer comment", async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
      })
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
      })
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
      })
    )

    const result = await sut.execute({
      answerId: "answer-1",
      page: 1,
    })

    expect(result.value?.answersComments).toHaveLength(3)
  })

  it("should be able to fetch paginated answer comments", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
        })
      )
    }

    const result = await sut.execute({
      answerId: "answer-1",
      page: 2,
    })

    expect(result.value?.answersComments).toHaveLength(2)
  })
})
