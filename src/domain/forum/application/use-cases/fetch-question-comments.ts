import { Either, rigth } from "@/core/either"
import { QuestionComment } from "../../enterprise/entities/question-comment"
import { QuestionCommentRepository } from "../repositories/question-comment-repository"
import { Injectable } from "@nestjs/common"

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComment: QuestionComment[]
  }
>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComment =
      await this.questionCommentRepository.findManyByQuestionId(questionId, {
        page,
      })

    return rigth({
      questionComment,
    })
  }
}
