import { IsNotEmpty, IsString } from "class-validator";

export class RedSocialDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly slogan: string;
}
