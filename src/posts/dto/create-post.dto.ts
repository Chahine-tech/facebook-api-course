import { IsString, IsNotEmpty } from 'class-validator';
export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;
}
