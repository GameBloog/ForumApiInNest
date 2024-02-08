import { AsnwerRepository } from "../repositories/answers-repository"
import { AnswerComment } from "../../enterprise/entities/answer-comment"
import { AnswerCommentRepository } from "../repositories/answer-comments-repository"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Either, left, rigth } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"

interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>

export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AsnwerRepository,
    private answerCommentRepository: AnswerCommentRepository
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
    })

    await this.answerCommentRepository.create(answerComment)

    return rigth({
      answerComment,
    })
  }
}
