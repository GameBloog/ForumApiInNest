import { PaginationParams } from "@/core/repositorys/pagination-params"
import { Answer } from "../../enterprise/entities/answer"

export abstract class AsnwerRepository {
  abstract findById(id: string): Promise<Answer | null>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]>
  abstract create(answer: Answer): Promise<void>
  abstract save(answer: Answer): Promise<void>
  abstract delete(answer: Answer): Promise<void>
}
