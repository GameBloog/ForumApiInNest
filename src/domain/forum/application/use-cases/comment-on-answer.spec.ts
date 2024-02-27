import { InMemoryAnswerRepository } from "test/repositories/in-memory-answers-repositories"
import { makeAnswer } from "test/factories/make-answer"
import { CommentOnAnswerUseCase } from "./comment-on-answer"
import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository"
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository"
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repostirory"
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repostirory"

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentRepository
let sut: CommentOnAnswerUseCase

describe("Comment on Answer", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentsRepository
    )
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentsRepository
    )
  })

  it("should be able to comment on answer", async () => {
    const answer = makeAnswer()

    await inMemoryAnswerRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: "Comentário teste",
    })

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      "Comentário teste"
    )
  })
})
