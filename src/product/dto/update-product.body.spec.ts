import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { UpdateProductBodyDto } from './update-product.body';

describe('UpdateProductBodyDto', () => {
  it('price와 discountPrice가 모두 undefined일 때 유효성 검사를 통과해야 합니다', async () => {
    const dto = plainToInstance(UpdateProductBodyDto, { name: 'Test Product' });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('price와 discountPrice가 모두 제공된 경우 유효성 검사를 통과해야 합니다', async () => {
    const dto = plainToInstance(UpdateProductBodyDto, {
      name: 'Test Product',
      price: 1000,
      discountPrice: 800,
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('price만 제공되고 discountPrice가 제공되지 않은 경우 BadRequestException을 발생시켜야 합니다', async () => {
    const dto = plainToInstance(UpdateProductBodyDto, {
      name: 'Test Product',
      price: 1000,
    });

    const result = () => validate(dto);

    expect(result).toThrow(BadRequestException);
  });

  it('discountPrice만 제공되고 price가 제공되지 않은 경우 BadRequestException을 발생시켜야 합니다', async () => {
    const dto = plainToInstance(UpdateProductBodyDto, {
      name: 'Test Product',
      discountPrice: 800,
    });

    const result = () => validate(dto);

    expect(result).toThrow();
  });

  it('유효하지 않은 price 또는 discountPrice가 제공된 경우 유효성 검사 오류가 발생해야 합니다', async () => {
    const dto = plainToInstance(UpdateProductBodyDto, {
      name: 'Test Product',
      price: -1000, // Invalid price
      discountPrice: Number.MAX_SAFE_INTEGER + 1, // Invalid discountPrice
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
    expect(errors[1].constraints).toHaveProperty('max');
  });
});
