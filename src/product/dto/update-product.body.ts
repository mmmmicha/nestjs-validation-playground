import { BadRequestException } from '@nestjs/common';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdateProductBodyDto {
  @IsString()
  public name!: string;

  @ValidateIf((obj) => {
    if (obj.price !== undefined && obj.discountPrice === undefined) {
      throw new BadRequestException(
        'discountPrice 값이 존재해야만 price 값을 수정할 수 있습니다',
      );
    }
    return false;
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  public price?: number;

  @ValidateIf((obj) => {
    if (obj.price === undefined && obj.discountPrice !== undefined) {
      throw new BadRequestException(
        'price 값이 존재해야만 discountPrice 값을 수정할 수 있습니다',
      );
    }
    return false;
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  public discountPrice?: number;
}
