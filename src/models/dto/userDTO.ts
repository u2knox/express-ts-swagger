import { Trim } from "class-sanitizer";
import { IsString, MaxLength, MinLength } from "class-validator";

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
  @MinLength(5, { message: "username should be minimum of 5 characters" })
  @MaxLength(50, { message: "username should be maximum of 50 characters" })
  public username: string;

  @IsString()
  @Trim()
  @MinLength(5, { message: "username should be minimum of 5 characters" })
  @MaxLength(50, { message: "username should be maximum of 50 characters" })
  public password: string;
}
