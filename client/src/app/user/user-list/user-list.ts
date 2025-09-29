import { Component, OnInit } from '@angular/core';
import { IUser, User } from 'soap-models/users';
import { UserService } from '../user-service';

@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit {
  users: IUser[] = [];
  constructor(
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers() {
    this.userService.getUsers().subscribe(res => {
      this.users = res.body as IUser[];
      const user = new User();
    })
  }
}
