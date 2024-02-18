import { Either, left, rigth } from "@/core/either"
import { Answer } from "../../enterprise/entities/answer"
import { AsnwerRepository } from "../repositories/answers-repository"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment"
import { AnswersAttachmentRepository } from "../repositories/answer-attachmentIds-repository"
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Injectable } from "@nestjs/common"

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  attachmentIds: string[]
  content: string
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private asnwerRepository: AsnwerRepository,
    private answerAttachmentRepository: AnswersAttachmentRepository
  ) {}

  async execute({
    authorId,
    answerId,
    attachmentIds,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.asnwerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.answerAttachmentRepository.findManyByAnswerId(answerId)

    const answerAttachmentList = new AnswerAttachmentList(
      currentQuestionAttachments
    )

    const questionAttachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(questionAttachments)

    answer.attachment = answerAttachmentList

    answer.content = content

    await this.asnwerRepository.save(answer)

    return rigth({ answer })
  }
}
