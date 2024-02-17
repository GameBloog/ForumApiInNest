import { AnswersAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachmentIds-repository"
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { PrismaAnswerAttachmenttMapper } from "../mappers/prisma-answer-attachment-mapper"

@Injectable()
export class PrismaAnswersAttachmentRepository
  implements AnswersAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    })

    return answerAttachments.map(PrismaAnswerAttachmenttMapper.toDomain)
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    })
  }
}
