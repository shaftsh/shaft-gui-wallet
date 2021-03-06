import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {SendComponent, SendDialog} from './send/send.component';
import {HomeComponent, TransactionDetailsDialog} from './home/home.component';
import {RouterModule, Routes} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatExpansionModule, MatIconModule, MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule, MatSnackBarModule, MatTableModule,
  MatToolbarModule, MatTooltipModule
} from "@angular/material";
import {SidenavComponent} from './sidenav/sidenav.component';
import {AccountsComponent, CreateAccountDialog} from './accounts/accounts.component';
import {CoreModule} from "./core.module";
import {AccountComponent} from "./account/account.component";
import {UnitConvertWeiToEther} from "./util/pipes/unit-converter-pipe";
import {ShaftIconComponent} from "./directives/shaft-icon/shaft-icon";
import {ArrowIconComponent} from "./directives/arrow-icon/arrow-icon";

const appRoutes: Routes = [
  {path: 'send', component: SendComponent},
  {path: 'home', component: HomeComponent},
  {path: 'accounts', component: AccountsComponent},
  {path: 'account/:addressHash', component: AccountComponent},
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    SendComponent,
    HomeComponent,
    SidenavComponent,
    AccountsComponent,
    AccountComponent,
    SendDialog,
    CreateAccountDialog,
    TransactionDetailsDialog,
    ShaftIconComponent,
    ArrowIconComponent,
    UnitConvertWeiToEther],
  entryComponents: [CreateAccountDialog, SendDialog, TransactionDetailsDialog],
  imports: [
    CoreModule,
    BrowserModule, RouterModule.forRoot(
      appRoutes,
      {enableTracing: false, useHash: true} // <-- debugging purposes only
    ), BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatPaginatorModule
  ],
  bootstrap: [AppComponent]
})


export class AppModule {
}
