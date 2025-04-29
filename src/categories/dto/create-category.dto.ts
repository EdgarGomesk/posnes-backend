import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString({
        message: 'El nombre debe ser una cadena de caracteres'
    })
    @IsNotEmpty({
        message: 'El Nombre de la Categoría no puede ir vacio'
    })
    name: string
}
