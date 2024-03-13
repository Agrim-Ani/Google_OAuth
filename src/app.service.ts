import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { test } from './entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
    constructor(
    @InjectRepository(test)
    private userRepository: Repository<test>,
    private jwtService: JwtService
  ) {}

  async findOrCreate(userDetails: Partial<test>): Promise<test> {
    // let user = await this.userRepository.save(userDetails);
    let user = await this.userRepository.findOne({where:{ email: userDetails.email }});
    if (!user) {
      user = this.userRepository.create(userDetails);
      user = await this.userRepository.save(user);
    }
    return user;
  }
  async generateToken(user: any): Promise<string> {
    const payload = { 
        email: user.email, 
        id: user.id 
    };
    return this.jwtService.sign(payload);
  }
  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }
    const {email, firstName, lastName, picture, accessToken} = req.user;
    const new_user = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      picture: picture,
    }
    const user = await this.findOrCreate(new_user);
    let token = this.generateToken(user)
    console.log({token});
    let test = ''
    
    console.log(typeof await token.then((data)=>{ return data}));
    
    return {jwt : await token.then((data)=>{ return data})} ;
  }
}
