import { IsNumberString, IsOptional } from "class-validator";

export class GetProductsQueryDto {
    @IsOptional()
    @IsNumberString({}, {message: 'La categoria debe ser un numero'})
    category_id: number

    @IsOptional()
    @IsNumberString({}, {message: 'La cantidad debe ser un numero'})
    take: number

    @IsOptional()
    @IsNumberString({}, {message: 'La cantidad debe ser un numero'})
    skip: number

}