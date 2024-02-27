import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repositories"
import { makeQuestion } from "test/factories/make-question"
import { CommentOnQuestionUseCase } from "./comment-on-question"
import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comments-repository"
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository"
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repostirory"
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repostirory"

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentRepository
let sut: CommentOnQuestionUseCase

describe("Comment on Question", () => {
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
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentsRepository
    )
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentsRepository
    )
  })

  it("should be able to comment on question", async () => {
    const question = makeQuestion()

    await inMemoryQuestionRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: "Comentário teste",
    })

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      "Comentário teste"
    )
  })
})
