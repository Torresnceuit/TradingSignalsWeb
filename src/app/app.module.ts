import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SignalDisplayComponent } from './components/signal-display/signal-display.component';
import { SignalService } from './services/signal.service';
import { HttpService } from './http/http.service';
import { AppRoutingModule } from './/app-routing.module';
import { TokenService } from './services/token.service';
import { HttpClient, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RequestInterceptor } from './http/interceptor';
import { DisplayLongShortComponent } from './components/display-long-short/display-long-short.component';


@NgModule({
  declarations: [
    AppComponent,
    SignalDisplayComponent,
    DisplayLongShortComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    SignalService, 
    HttpService, 
    TokenService,
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
