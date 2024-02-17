import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Answer } from "../../enterprise/entities/answer"
import { AsnwerRepository } from "../repositories/answers-repository"
import { Either, rigth } from "@/core/either"
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment"
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list"
import { Injectable } from "@nestjs/common"

interface AnswerQuestionUseCaseRequest {
  authorId: string
  questionId: string
  attachmentIds: string[]
  content: string
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answerRepository: AsnwerRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachmentIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityID(authorId),
      content,
      questionId: new UniqueEntityID(questionId),
    })

    const answerAttachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    })

    answer.attachment = new AnswerAttachmentList(answerAttachments)

    await this.answerRepository.create(answer)

    return rigth({
      answer,
    })
  }
}
