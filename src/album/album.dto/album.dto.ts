import {IsDate, IsDateString, IsNotEmpty, IsString} from 'class-validator';

export class AlbumDto {
    @IsDateString()
    @IsNotEmpty()
    readonly fechaInicio: Date;
    
    @IsDateString()
    @IsNotEmpty()
    readonly fechaFin: Date;
    
    @IsString()
    @IsNotEmpty()
    readonly titulo: string;
    
}
