import { PaginationParams } from "@/core/repositorys/pagination-params"
import { QuestionComment } from "../../enterprise/entities/question-comment"

export interface QuestionCommentRepository {
  findById(id: string): Promise<QuestionComment | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>
  create(questionComment: QuestionComment): Promise<void>
  delete(questionComment: QuestionComment): Promise<void>
}
