import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { paginationDTO } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log("Data base connected");
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    })
  }

  async findAll( paginationDto :paginationDTO) {

    const {page, limit} = paginationDto;

    const totalPages = await this.product.count({where:{available:true}});

    const lastPage = Math.ceil(totalPages/limit)

    return{
              date: await this.product.findMany({
                  skip: (page - 1) * limit,
                  take: limit,
                  where:{
                    available:true
                  }
                }),
              meta:{
                total: totalPages,
                page: page,
                lastPage: lastPage
              }
          }
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {id: id, available: true}
    });

    if(!product){
      throw new NotFoundException(`Product with id #${id} not found`);
    }

    return product;
    // return `This action returns a #${id} product`;
  }

 async update(id: number, updateProductDto: UpdateProductDto) {

  const { id: __, ...data} = updateProductDto
    
    await this.findOne(id)
  
    return this.product.update({
      where: {id},
      data: data,
    })
    // return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    await this.findOne(id)

    return this.product.update({
      where:{id},
      data:{
        available: false,
      }
    })

    // return this.product.delete({
    //   where: {id}
    // });
  }
}
