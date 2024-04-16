import { Trim } from "class-sanitizer";
import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class SignUpDTO {

  @IsString()
  @Trim()
  @MinLength(5, { message: "username should be minimum of 5 characters" })
  @MaxLength(50, { message: "username should be maximum of 50 characters" })
  public username: string;

  @IsString()
  @Trim()
  @MinLength(5, { message: "username should be minimum of 5 characters" })
  @MaxLength(50, { message: "username should be maximum of 50 characters" })
  public password: string;
}

export class SignInDTO {

  @IsString()
  @Trim()
  @MinLength(4, { message: "username should be minimum of 4 characters" })
  @MaxLength(50, { message: "username should be maximum of 50 characters" })
  public username: string;

  @IsString()
  @Trim()
  @MinLength(4, { message: "username should be minimum of 4 characters" })
  @MaxLength(50, { message: "username should be maximum of 50 characters" })
  public password: string;
}

@Exclude()
export class UserDTO {
  @Expose()
  @IsNumber()
  public id: number;

  @Expose()
  @IsString()
  public username: string;
}
