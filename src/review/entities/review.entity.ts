import { ApiProperty } from "@nestjs/swagger";
import { Review } from "@prisma/client";
import { UserEntity } from "src/user/entities/user.entity";



export class ReviewEntity implements Review {

    @ApiProperty()
    id: number

    @ApiProperty()
    title: string

    @ApiProperty()
    content: string

    @ApiProperty({required: false, nullable: true}) //*TODO: for now. change this to be required later on when all is fixed!!!
    authorId: number | null

    @ApiProperty({ required: false, type: UserEntity})
    author?: UserEntity

    constructor({ author, ...data }: Partial<ReviewEntity>) {
        Object.assign(this, data)

        if (author) {
            this.author = new UserEntity(author)
        }
    }

    @ApiProperty()
    bookmarks: number
    

    @ApiProperty({isArray: true})
    bookmarkedBy: []

    @ApiProperty()
    upvotes: number

    @ApiProperty()
    downvotes: number

    @ApiProperty({required: false, isArray: true})
    upvotedBy: []

    @ApiProperty({required: false, isArray: true})
    downvotedBy: []

    @ApiProperty({ isArray: true })
    comments: []

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date

}