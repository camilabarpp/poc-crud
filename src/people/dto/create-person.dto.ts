import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreatePersonDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Age is required' })
  age: number;
}
