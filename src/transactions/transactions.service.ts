import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';


@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly ProductRepository: Repository<Product>
  ) { }

  async create(createTransactionDto: CreateTransactionDto) {
    await this.ProductRepository.manager.transaction(async (transactionEntityManager) => {
      const transaction = new Transaction()

      for (const contents of createTransactionDto.contents) {
        const product = await transactionEntityManager.findOneBy(Product, { id: contents.productId })
        transaction.total = createTransactionDto.contents.reduce((total, item) => total + (item.quantity * item.price), 0)
        const errors: string[] = []

        if (!product) {
          errors.push('El producto no existe')
          throw new NotFoundException(errors)
        }
        if (product.inventory <= 0 || contents.quantity > product.inventory) {
          errors.push("No hay cantidad suficiente para el producto " + product.name)
          throw new BadRequestException(errors)
        }
        product.inventory -= contents.quantity


        // CREATE TRANSACTIONS CONTENTS INSTACE
        const transactionContent = new TransactionContents()
        transactionContent.price = contents.price
        transactionContent.product = product
        transactionContent.quantity = contents.quantity
        transactionContent.transaction = transaction

        await transactionEntityManager.save(transaction)
        await transactionEntityManager.save(transactionContent)

      }
    })
    return "Venta Almacenada Correctamente"
  }

  findAll(transactionDate? : string) {
    const options : FindManyOptions<Transaction> = {
      relations: {
        contents: true
      }
    }
    const errors : string[] = []
    if(transactionDate){
      const date = parseISO(transactionDate)
      if(!isValid(date)){
        errors.push('Fecha no valida')
        throw new BadRequestException(errors)
      }
      const start = startOfDay(date)
      const end = endOfDay(date)

      options.where = {
        transactionDate: Between(start, end)
      }
    }
    return this.transactionRepository.find(options)
  }

  async findOne(id: number) {
    const errors : string[] = []
    const transaction = await this.transactionRepository.findOne({
      where: {
        id
      },
      relations: {
        contents: true
      }
    })

    if(!transaction){
      errors.push('Transcción no encontrada')
      throw new NotFoundException(errors)
    }

    return transaction
  }

  //update(id: number, updateTransactionDto: UpdateTransactionDto) {
   // return `This action updates a #${id} transaction`;
  //}

  async remove(id: number) {
    const transaction = await this.findOne(id)
    const errors : string[] = []
    for(const contents of transaction.contents) {
      const product = await this.ProductRepository.findOneBy({id: contents.product.id})
      product!.inventory += contents.quantity
      await this.ProductRepository.save(product!)
      const transactionContents = await this.transactionContentsRepository.findOneBy({id: contents.id})
      await this.transactionContentsRepository.remove(transactionContents!)
    }
    await this.transactionRepository.remove(transaction)
    return 'Venta Eliminada correctamente'
  }
}
