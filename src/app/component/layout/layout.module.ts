import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
  ],
})
export class LayoutModule {}
