import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { NotificationService } from "../services/notification.service";
import { User } from "../models/user";
import { Subscription } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationType } from "../enum/notification-type.enum";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  showLoading: boolean;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl("/user/management");
    }
  }

  onRegister(user: User): void {
    this.showLoading = true;
      this.subscriptions.push(
        this.authenticationService.register(user).subscribe(
          (response: User) => {
            this.showLoading = false;
            this.sendNotification(
              NotificationType.SUCCESS,
              `A new account was created for ${response.firstName}
              .Please check your email for password to login.`
            );
          },
          (errorResponse: HttpErrorResponse) => {
            this.sendNotification(
              NotificationType.ERROR,
              errorResponse.error.message
            );
          }
        )
      );

  }
  private sendNotification(
    notificationType: NotificationType,
    message: string
  ): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(
        notificationType,
        "An error occured. Please try again!"
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
