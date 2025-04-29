import { Controller, Get, Patch, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  getPost(): string {
    return "post"
  }
  @Put()
  getPut(): string {
    return "put"
  }
  @Patch()
  getPatch(): string {
    return "patch"
  }
}
