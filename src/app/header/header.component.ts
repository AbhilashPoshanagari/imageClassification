import { Component, OnInit } from '@angular/core';
import { PwaService } from '../services/pwa.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor( public pwaService: PwaService ) { }

  ngOnInit(): void {
  }

  installPwa(): void {
  this.pwaService.promptEvent.prompt();
    }
}
