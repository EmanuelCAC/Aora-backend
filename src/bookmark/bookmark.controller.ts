import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get('all/:id')
  getAll(@Param() params: {id: number}) {
    return this.bookmarkService.getAll(Number(params.id))
  }

  @Post('save')
  save(@Body() dto: {videoId: number, userId: number}) {
    return this.bookmarkService.save(dto.videoId, dto.userId) 
  }

  @Delete('unsave/:id')
  unsave(@Param() params: { id: number}) {
    return this.bookmarkService.unsave(Number(params.id)) 
  }
}
