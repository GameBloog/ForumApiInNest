import { Either, rigth } from "@/core/either"
import { AnswerComment } from "../../enterprise/entities/answer-comment"
import { AnswerCommentRepository } from "../repositories/answer-comments-repository"
import { Injectable } from "@nestjs/common"

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answersComments: AnswerComment[]
  }
>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answernCommentRepository: AnswerCommentRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answersComments =
      await this.answernCommentRepository.findManyByAnswerId(answerId, {
        page,
      })

    return rigth({
      answersComments,
    })
  }
}
