import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { seedProducts } from './seeds/product.seed';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(createProductDto: CreateProductDto) {
    return this.productRepository.create(createProductDto);
  }

  async findAllPublished(query: Record<string, any> = {}) {
    seedProducts(this.productRepository);
    const { page, limit, ...filter } = query;
    return this.productRepository.paginate({
      defaultFilter: { isActive: true },
      filter,
      page,
      limit,
      sort: { name: 1 },
    });
  }

  async findAll(query: Record<string, any> = {}) {
    return this.productRepository.find(query);
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.productRepository.findOneAndUpdate(
      { _id: id },
      updateProductDto,
    );
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string) {
    const deletedProduct = await this.productRepository.deleteOne({ _id: id });
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return deletedProduct;
  }
}
