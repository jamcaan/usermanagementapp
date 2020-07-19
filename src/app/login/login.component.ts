import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { NotificationService } from "../services/notification.service";
import { User } from "../models/user";
import { Subscription } from "rxjs";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { NotificationType } from "../enum/notification-type.enum";
import { HeaderType } from "../enum/header-type.enum";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
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
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  onLogin(user: User): void {
    this.showLoading = true;
      this.subscriptions.push(
        this.authenticationService.login(user).subscribe(
          (response: HttpResponse<User>) => {
            const token = response.headers.get(HeaderType.JWT_TOKEN);
            this.authenticationService.saveToken(token);
            this.authenticationService.addUserToLocalCache(response.body);
            this.router.navigateByUrl("/user/management");
            this.showLoading = false;
          },
          (errorResponse: HttpErrorResponse) => {
            this.sendErrorNotification(
              NotificationType.ERROR,
              errorResponse.error.message
            );
          }
        )
      );

  }
  private sendErrorNotification(
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
