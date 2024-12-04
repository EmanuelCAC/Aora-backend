import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class VideoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @IsString()
  @IsNotEmpty()
  video: string;
  
  @IsString()
  @IsOptional()
  prompt: string

  @IsNotEmpty()
  @IsNumber()
  creatorId: number
}