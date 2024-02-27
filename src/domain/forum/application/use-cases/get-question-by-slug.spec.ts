import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repositories"
import { GetQuestionBySlugUseCase } from "./get-question-by-slug"
import { makeQuestion } from "test/factories/make-question"
import { Slug } from "../../enterprise/entities/value-objects/slug"
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository"
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repostirory"
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repostirory"
import { makeStudent } from "test/factories/make-student"
import { makeAttachment } from "test/factories/make-attachment"
import { makeQuestionAttachment } from "test/factories/make-question-attachment"

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe("Get Question By Slug", () => {
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
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
  })

  it("should be able to get a question by slug", async () => {
    const student = makeStudent({
      name: "John Doe",
    })

    inMemoryStudentsRepository.items.push(student)

    const newQuestion = makeQuestion({
      authorId: student.id,
      slug: Slug.create("example-question"),
    })

    inMemoryQuestionRepository.create(newQuestion)

    const attachment = makeAttachment({
      title: "Some attachment",
    })

    inMemoryAttachmentsRepository.items.push(attachment)

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      })
    )

    const result = await sut.execute({
      slug: "example-question",
    })

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: "John Doe",
        attachments: [
          expect.objectContaining({
            title: "Some attachment",
          }),
        ],
      }),
    })
  })
})
