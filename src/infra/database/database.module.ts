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
    PrismaQuestionsCommentsRepository,
    PrismaQuestionsAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaAnswersCommentsRepository,
    PrismaAnswersAttachmentRepository,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    PrismaQuestionsCommentsRepository,
    PrismaQuestionsAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaAnswersCommentsRepository,
    PrismaAnswersAttachmentRepository,
  ],
})
export class DatabaseModule {}
