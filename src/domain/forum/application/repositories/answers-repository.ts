import { PaginationParams } from "@/core/repositorys/pagination-params"
import { Answer } from "../../enterprise/entities/answer"

export interface AsnwerRepository {
  findById(id: string): Promise<Answer | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]>
  create(answer: Answer): Promise<void>
  save(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
}
