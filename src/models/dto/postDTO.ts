import { Trim } from "class-sanitizer";
import { IsString, MaxLength, MinLength } from "class-validator";

export class AddCategoryDTO {
  @IsString()
  @Trim()
  @MinLength(5, { message: 'Name is so shorty' })
  name: string;
}

export class AddPostDTO {
  @IsString()
  @Trim()
  @MinLength(3, { message: 'Title is so shorty' })
  @MaxLength(100, { message: 'Title is so large' })
  title: string;
  
  userId: number;

  categoryId: number;

  @IsString()
  @Trim()
  @MinLength(3, { message: 'Body is so shorty' })
  @MaxLength(600, { message: 'Body is so large' })
  body: string;

  img: string;
}

export class EditPostDTO {
  @IsString()
  @Trim()
  @MinLength(3, { message: 'Title is so shorty' })
  @MaxLength(100, { message: 'Title is so large' })
  title: string;
  
  userId: number | undefined;

  categoryId: number | undefined;

  @IsString()
  @Trim()
  @MinLength(3, { message: 'Body is so shorty' })
  @MaxLength(600, { message: 'Body is so large' })
  body: string;

  img: string | undefined;
}