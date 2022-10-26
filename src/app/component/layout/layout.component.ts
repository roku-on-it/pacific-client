import { Component, OnInit } from '@angular/core';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  navLinks: NavItem[] = [
    { icon: 'home', label: 'Home', path: 'home' },
    { icon: 'settings', label: 'Settings', path: 'auth' },
    { icon: 'devices', label: 'Manage Sessions', path: 'sessions' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
