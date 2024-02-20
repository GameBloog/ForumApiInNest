import { Module } from "@nestjs/common"
import { PrismaService } from "./prisma/prisma.service"
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository"
import { PrismaQuestionsCommentsRepository } from "./prisma/repositories/prisma-question-comment-repository"
import { PrismaQuestionsAttachmentsRepository } from "./prisma/repositories/prisma-question-attachmentIds-repository"
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository"
import { PrismaAnswersCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository"
import { PrismaAnswersAttachmentRepository } from "./prisma/repositories/prisma-answer-attachmentIds-repository"
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository"
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository"
import { PrismaStudentsRepository } from "./prisma/repositories/prisma-students-repository"
import { AnswersAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachmentIds-repository"
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment"
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository"
import { QuestionsAttachmentRepository } from "@/domain/forum/application/repositories/question-attachmentIds-repository"
import { AsnwerRepository } from "@/domain/forum/application/repositories/answers-repository"
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comments-repository"
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository"
import { PrismaAttachmentRepository } from "./prisma/repositories/prisma-attachment-repository"

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionCommentRepository,
      useClass: PrismaQuestionsCommentsRepository,
    },
    {
      provide: QuestionsAttachmentRepository,
      useClass: PrismaQuestionsAttachmentsRepository,
    },
    { provide: AsnwerRepository, useClass: PrismaAnswersRepository },
    {
      provide: AnswerCommentRepository,
      useClass: PrismaAnswersCommentsRepository,
    },
    {
      provide: AnswersAttachmentRepository,
      useClass: PrismaAnswersAttachmentRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    QuestionCommentRepository,
    QuestionsAttachmentRepository,
    AsnwerRepository,
    AnswerCommentRepository,
    AnswersAttachmentRepository,
    AttachmentsRepository,
  ],
})
export class DatabaseModule {}
