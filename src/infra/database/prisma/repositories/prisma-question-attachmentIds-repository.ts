import { QuestionsAttachmentRepository } from "@/domain/forum/application/repositories/question-attachmentIds-repository"
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper"

@Injectable()
export class PrismaQuestionsAttachmentsRepository
  implements QuestionsAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]> {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    })

    return answerAttachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    })
  }
}
