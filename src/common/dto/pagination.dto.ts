import { Type } from "class-transformer"
import { IsOptional, IsPositive } from "class-validator"

export class paginationDTO{

    @IsPositive()
    @IsOptional()
    @Type(()=>Number)
    page?: number = 1 
    
    @IsPositive()
    @IsOptional()
    @Type(()=>Number)
    limit?: number = 10

}