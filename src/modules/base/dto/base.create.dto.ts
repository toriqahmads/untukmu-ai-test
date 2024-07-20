import { Allow, IsOptional } from 'class-validator';

export class BaseCreateDto {
  @Allow()
  @IsOptional()
  context?: {
    params: any;
    query: any;
    user: any;
  };
}
