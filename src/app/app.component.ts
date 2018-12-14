import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HeroService} from "./hero.service";
import {Mark} from "./mark";
import {MapService} from "./map.service";
import {AppTempService} from "./app-temp.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '地图搜租房';

  page = 1;
  size = 30;
  intervalDay = 14;
  fromPrice = 2000;
  toPrice = 5000;


  isCollapsed = false;
  triggerTemplate = null;
  @ViewChild('trigger') customTrigger: TemplateRef<void>;

  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }


  constructor(
    private mapService: MapService,
    private appTempService: AppTempService

  ) {

  }

  ngOnInit() {
    //
    this.mapService.initMap();
    // this.city_item = this.appTempService.city_item;
  }

  search(){
    console.log('do search');
    this.mapService.search(this.page, this.size, this.intervalDay, this.fromPrice, this.toPrice);
  }

}

