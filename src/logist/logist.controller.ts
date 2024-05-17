import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { UserGuard } from '../user/guards/user.guard';
import { EditUserDto } from '../user/dtos/EditUser.dto';
import { Roles } from '../user/domain/roles.enum';
import { Role } from '../user/decorators/role.decorator';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Me } from '../user/decorators/Me.decorator';

@Controller('logist')
@UseGuards(UserGuard)
export class LogistController {
  constructor(private readonly userService: UserService) {}
  @Put('edit')
  @Role(Roles.LOGISTIC)
  async editLogist(@Me() user: User, @Body() dto: EditUserDto) {
    const success = this.userService.updateUser(user.id, dto);
    return { success: success };
  }
}
