import { GoogleOAuthGuard } from './google-oauth.guard';
import { Headers,Controller, Get, Request, UseGuards, Response } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('api/v1/google/callback')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.appService.googleLogin(req);
  }
@Get('profile')
  async getUserProfile(@Headers('authorization') authorization: string): Promise<any> {
    const token = authorization.split(' ')[1];
    console.log(token);
    const decodedUser = await this.appService.validateToken(token);
    return decodedUser;
  }
}
