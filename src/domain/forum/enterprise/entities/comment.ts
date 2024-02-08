import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface CommentProps {
  authorId: UniqueEntityID
  content: string
  createdAt: Date
  updatdeAt?: Date
}
export abstract class Comment<Props extends CommentProps> extends Entity<Props> {
  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatdeAt() {
    return this.props.updatdeAt
  }

  private touch() {
    this.props.updatdeAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }
}
