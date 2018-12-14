import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';


import { AppRoutingModule }     from './app-routing.module';

import { AppComponent }         from './app.component';
import {CityChooseComponent} from './city-choose/city-choose.component'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);

import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

import { NZ_ICONS } from 'ng-zorro-antd';
// import { NZ_ICONS} from "ng-zorro-antd/icon";

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,



    BrowserAnimationsModule,

    NgZorroAntdModule
  ],
  declarations: [
    AppComponent,
    CityChooseComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    // { provide: NZ_ICON_DEFAULT_TWOTONE_COLOR, useValue: '#00ff00' }, // 不提供的话，即为 Ant Design 的主题蓝色
    { provide: NZ_ICONS, useValue: icons }]
})
export class AppModule { }
