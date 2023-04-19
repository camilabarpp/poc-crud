import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'people' })
export class Person {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The auto-generated id of the person' })
  id: number;

  @Column()
  @ApiProperty({ description: 'The name of the person' })
  name: string;

  @Column()
  @ApiProperty({ description: 'The age of the person' })
  age: number;

  @Column()
  @ApiProperty({ description: 'The email of the person' })
  email: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({ description: 'The date the person was created' })
  createdAt: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({ description: 'The date the person was last updated' })
  updatedAt: string;
}
