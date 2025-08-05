import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { IUser, User } from 'soap-models/dist/users';

@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss'
})
export class UsersList implements OnInit {
  users: IUser[] = [];
  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.authenticate('ernea5956@gmail.com', 'mko09IJNbhu8')
      .subscribe(res => {;
        this.users.push(res.body as IUser);
      });
  }
}
