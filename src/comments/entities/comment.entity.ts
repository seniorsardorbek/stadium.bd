import { IsMongoId, IsString, isMongoId } from "class-validator";

export class Comment {
  @IsString()
  text: string;

  @IsMongoId()
  commentBy: string;

  @IsMongoId()
  stadion: string;
}
