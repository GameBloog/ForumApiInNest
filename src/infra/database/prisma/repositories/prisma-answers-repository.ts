import { Injectable } from "@nestjs/common"
import { PaginationParams } from "@/core/repositorys/pagination-params"
import { AsnwerRepository } from "@/domain/forum/application/repositories/answers-repository"
import { Answer } from "@/domain/forum/enterprise/entities/answer"
import { PrismaService } from "../prisma.service"
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper"
import { AnswersAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachmentIds-repository"

@Injectable()
export class PrismaAnswersRepository implements AsnwerRepository {
  constructor(
    private prisma: PrismaService,
    private answersAttachmentRepository: AnswersAttachmentRepository
  ) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.create({
      data,
    })

    await this.answersAttachmentRepository.createMany(
      answer.attachment.getItems()
    )
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await Promise.all([
      this.prisma.answer.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.answersAttachmentRepository.createMany(
        answer.attachment.getNewItems()
      ),

      this.answersAttachmentRepository.deleteMany(
        answer.attachment.getRemovedItems()
      ),
    ])
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    })
  }
}
