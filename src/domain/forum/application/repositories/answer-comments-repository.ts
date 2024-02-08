import { PaginationParams } from "@/core/repositorys/pagination-params"
import { AnswerComment } from "../../enterprise/entities/answer-comment"

export interface AnswerCommentRepository {
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]>
  create(answerComment: AnswerComment): Promise<void>
  delete(answerComment: AnswerComment): Promise<void>
}
