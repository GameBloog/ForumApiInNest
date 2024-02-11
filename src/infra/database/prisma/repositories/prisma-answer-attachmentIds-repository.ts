import { AnswersAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachmentIds-repository"
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PrismaAnswersAttachmentRepository
  implements AnswersAttachmentRepository
{
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    throw new Error("Method not implemented.")
  }
  deleteManyByAnswerId(answerId: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
