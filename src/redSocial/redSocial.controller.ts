import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { RedSocialService } from './redSocial.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { RedSocialEntity } from './redSocial.entity/redSocial.entity';
import { RedSocialDto } from './redSocial.dto/redSocial.dto';
import { plainToInstance } from 'class-transformer';

@Controller('redSocial')
@UseInterceptors(BusinessErrorsInterceptor)
export class RedSocialController {
    constructor(private readonly redSocialService: RedSocialService) {}

    @Post()
    async createRedSocial(@Body() redSocialDto: RedSocialDto) {
      const redSocial: RedSocialEntity = plainToInstance(RedSocialEntity, redSocialDto);
      return await this.redSocialService.createRedSocial(redSocial);
    }
}
