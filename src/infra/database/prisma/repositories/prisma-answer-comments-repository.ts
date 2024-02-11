import { PaginationParams } from "@/core/repositorys/pagination-params"
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comments-repository"
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PrismaAnswersCommentsRepository
  implements AnswerCommentRepository
{
  findById(id: string): Promise<AnswerComment | null> {
    throw new Error("Method not implemented.")
  }
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]> {
    throw new Error("Method not implemented.")
  }
  create(answerComment: AnswerComment): Promise<void> {
    throw new Error("Method not implemented.")
  }
  delete(answerComment: AnswerComment): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
