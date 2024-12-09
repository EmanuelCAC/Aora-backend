import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class VideoDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @IsString()
  @IsOptional()
  prompt: string

  @IsNotEmpty()
  @IsString()
  creatorId: number
}