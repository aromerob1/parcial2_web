import {IsDate, IsDateString, IsNotEmpty, IsNumber} from 'class-validator';

export class FotoDto {
   @IsNumber()
   @IsNotEmpty()
   readonly ISO: number;

   @IsNumber()
   @IsNotEmpty()
   readonly velObturacion: number;

   @IsNumber()
   @IsNotEmpty()
   readonly apertura: number;

   @IsDateString()
   @IsNotEmpty()
   readonly fecha: Date;
}
