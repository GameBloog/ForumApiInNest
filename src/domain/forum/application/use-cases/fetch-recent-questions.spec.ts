import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repositories"
import { makeQuestion } from "test/factories/make-question"
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions"
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository"
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repostirory"
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repostirory"

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe("Fetch Recent Questions", () => {
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
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionRepository)
  })

  it("should be able to fetch recent questions", async () => {
    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) })
    )
    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18) })
    )
    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 23) })
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it("should be able to fetch paginated recent questions", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionRepository.create(makeQuestion())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.questions).toHaveLength(2)
  })
})
