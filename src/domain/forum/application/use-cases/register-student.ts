import { Either, left, rigth } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { Student } from "../../enterprise/entities/student"
import { StudentsRepository } from "../repositories/students-repository"
import { HashGenerator } from "../cryptography/hash-generator"
import { StudentAlreadyExistisError } from "./errors/student-already-existis-error"

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistisError,
  {
    student: Student
  }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentsRepository.findByEmail(
      email
    )

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistisError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.studentsRepository.create(student)

    return rigth({
      student,
    })
  }
}
