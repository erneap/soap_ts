import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { IUser, User } from 'soap-models/dist/users';
import { map } from 'rxjs';

@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss'
})
export class UsersList implements OnInit {
  users: IUser[] = [];
  constructor(
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(res => {
      this.users = res.body as IUser[];
    });
  }
}
