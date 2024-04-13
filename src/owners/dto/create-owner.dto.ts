import { IsBoolean } from 'class-validator'

export class CreateOwnerDto {
  @IsBoolean()
  verified: boolean
}
