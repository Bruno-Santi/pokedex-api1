import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePokemonDto {
  @IsInt({ message: 'Expected integer' })
  @IsPositive({ message: `No. Cannot be negative` })
  @Min(1)
  no: number;
  @IsString()
  @IsNotEmpty({ message: `Name cannot be empty` })
  @MinLength(2, { message: `Name cannot be less than 2 characters` })
  name: string;

  @IsString()
  image_url?: string;
  @IsString()
  type?: string;
}
