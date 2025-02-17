import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from '../user/dto/create-user.input';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginUserInput, RefreshTokenInput } from './dto/login-user.input';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Validate user
  async validateUser(loginUserInput: LoginUserInput) {
    const { email, password } = loginUserInput;
    const user = await this.userService.findUserByEmail(email);
    const isMatch = await bcrypt.compare(password, user?.password);
    if (user && isMatch) {
      return user;
    }
    return null;
  }

  // Sign up
  async signUp(createUserInput: CreateUserInput) {
    const user = await this.userService.findUserByEmail(createUserInput.email);
    if (user) {
      throw new Error('User already exists, login instead');
    }
    return this.userService.createUser(createUserInput);
  }

  // Log In
  signIn(user: User) {
    return {
      user,
      accessToken: this.jwtService.sign(
        {
          _id: user._id,
          email: user.email,
          userName: user.userName,
          sub: user._id,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '1h',
        },
      ),
      refreshToken: this.jwtService.sign(
        {
          email: user.email,
          userName: user.userName,
          sub: user._id,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '7d',
        },
      ),
    };
  }

  refreshToken(refreshTokenInput: RefreshTokenInput) {
    try {
      const payload = this.jwtService.verify(refreshTokenInput.refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      const newAccessToken = this.jwtService.sign(
        {
          email: payload.email,
          userName: payload.userName,
          sub: payload.sub,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '1h',
        },
      );
      return { accessToken: newAccessToken };
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }

  // TODO: Change to return JWT in a cookie
  // Setting the value (access and refresh tokens) in a cookie has several benefits, particularly related to security and ease of use.
  // Here are some reasons why storing tokens in HTTP-only, secure cookies can be advantageous:
  //
  // 1. Security Benefits
  // HTTP-Only Cookies: Cookies marked as HttpOnly cannot be accessed via JavaScript, which helps mitigate the risk of Cross-Site Scripting (XSS) attacks.
  // This means even if an attacker injects malicious scripts into your application, they cannot steal the tokens.
  //
  // Secure Cookies: Cookies marked as Secure are only sent over HTTPS connections, ensuring that the tokens are encrypted during transit.
  // This prevents token leakage through unsecured connections.
  //
  // Automatic Handling: Browsers handle cookies automatically, sending them with each request to the server.
  // This reduces the risk of tokens being exposed through client-side storage (like localStorage or sessionStorage), which is more susceptible to attacks.
  //
  // 2. Ease of Use
  // Simplified Client-Side Code: When tokens are stored in cookies, the client-side code doesn't need to manually attach tokens to each request.
  // This simplifies the code and reduces the chance of errors.
  //
  // Centralized Management: Managing tokens in cookies allows for a more centralized and consistent approach to handling authentication and authorization.
  // The server can set and refresh cookies without relying on the client to store and send tokens correctly.
  //
  // 3. Protection Against Certain Attacks
  // Cross-Site Request Forgery (CSRF): While cookies are susceptible to CSRF attacks, proper implementation of CSRF tokens (stored in cookies) can provide strong protection.
  // Coupling CSRF tokens with HTTP-only, secure cookies ensures robust security.

  // https://johannes.co/server-side-authentication-with-nextjs-and-nestjs-part-1-the-basics
}
