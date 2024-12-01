import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  userType: string = ''; 

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.userType = await this.authService.getCurrentUserType();
  }
}
