import {Component, OnInit} from '@angular/core';
import {AppTempService} from "../app-temp.service";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs/internal/operators";
import {SourceCityResponse} from "../domain/source-city-response";
import {SourceCity} from "../domain/source-city";
import {TreeLeaf} from "../domain/tree-leaf";
import {TreeNode} from "../domain/tree-node";
import {MapService} from "../map.service";


@Component({
  selector: 'app-city-choose',
  templateUrl: './city-choose.component.html',
  styleUrls: ['./city-choose.component.css']
})
export class CityChooseComponent implements OnInit{
  visible = false;


  city = '上海';
  source = 'douban';
  displaySource = '豆瓣';


  constructor(private http: HttpClient, private mapService: MapService) {
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  expandKeys = ['100', '1001'];
  value: string;
  nodes = [{
    title: 'parent 1',
    key: '100',
    children: [{
      title: 'parent 1-0',
      key: '1001',
      children: [
        {title: 'leaf 1-0-0', key: '10010', isLeaf: true},
        {title: 'leaf 1-0-1', key: '10011', isLeaf: true}
      ]
    }, {
      title: 'parent 1-1',
      key: '1002',
      children: [
        {title: 'leaf 1-1-0', key: '10020', isLeaf: true}
      ]
    }]
  }];


  onChange($event: string): void {
    console.log($event);
    this.city = $event.split(',')[0];
    this.source =  $event.split(',')[1];
    this.displaySource = $event.split(',')[2];


    this.mapService.city = this.city;
    this.mapService.source = this.source;


  }

  ngOnInit(): void {
    // mock async
    setTimeout(() => {
      this.value = '1001';
    }, 1000);

   this.http.get<SourceCityResponse>('https://woyaozufang.live/v2/cities?index=0&count=1')
      .pipe(
        tap((data: SourceCityResponse) => {
          console.log(data.data);

          if (data.success == false){
            this.nodes = [];
            return;
          }

          let nodes:Array<TreeNode> = [];
          for(let city of data.data){
            let leafs :Array<TreeLeaf> = [];
            for (let item of city.sources){
              let leaf = new TreeLeaf();
              leaf.isLeaf = true;
              leaf.key = item.city + ','+item.source+','+item.displaySource;
              leaf.title = item.city + item.displaySource;
              leafs.push(leaf);

            }

            let node = new TreeNode();
            node.children = leafs;
            node.key = city.city;
            node.title = city.city;
            nodes.push(node);
          }
          this.nodes = nodes;


        }
        )
      ).subscribe();
  }
}
