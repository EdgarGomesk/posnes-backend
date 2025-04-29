import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { Category } from "src/categories/entities/category.entity"

export class CreateProductDto {
    @IsNotEmpty({message: 'El nombre del Producto es Obligatorio'})
    @IsString({message: 'Nombre no válido'})
    name: string

    @IsNotEmpty({message: 'El precio del Producto es Obligatorio'})
    @IsNumber({maxDecimalPlaces: 2}, {message: 'Precio no válido'})
    price: number

    @IsNotEmpty({message: 'La cantidad no puede ir vacia'})
    @IsNumber({maxDecimalPlaces: 0}, {message: 'Cantidad no válida'})
    inventory: number

    @IsNotEmpty({message: 'La categoria es obligatoria'})
    @IsInt({message: 'La categoria no es válida'})
    categoryId: Category
}
