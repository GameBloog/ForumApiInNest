import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment"
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client"

export class PrismaAnswerAttachmenttMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error("Invalid attachment type.")
    }

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        answerId: new UniqueEntityID(raw.answerId),
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrismaUpdatemany(
    attachment: AnswerAttachment[]
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachment.map((attachments) => {
      return attachments.attachmentId.toString()
    })

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        answerId: attachment[0].answerId.toString(),
      },
    }
  }
}
