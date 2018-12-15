import {Injectable, OnInit} from '@angular/core';
import {Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs/internal/operators";
import {HouseResponse} from "./domain/house-response";

declare let L;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map;
  baseLayers = {
    "底图": L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    })
  };
  overlays = {};

  layerControls;
  markerCluster = null;

  constructor(private http: HttpClient) {
  }


  initMap() {







    // leaflet
    this.map = L.map('mapTwo', {
      crs: L.CRS.EPSG3857,
      contextmenu: true,
      contextmenuWidth: 140,
      contextmenuItems: [{
        text: 'Show coordinates',
        callback: function (e) {
          alert(e.latlng);
        }
      }, {
        text: 'Center map here',
        callback: (e => {
          this.map.panTo(e.latlng);
        })
      }, '-', {
        text: 'Zoom in',
        icon: 'assets/image/icon/zoom-in.png',
        callback: (e => {
          this.map.zoomIn();
        })
      }, {
        text: 'Zoom out',
        icon: 'assets/image/icon/zoom-out.png',
        callback: (e => {
          this.map.zoomOut();
        })
      }]
    }).setView([31.231706, 121.472644], 10);

    // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //   maxZoom: 18,
    //   id: 'mapbox.streets',
    //   accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    // }).addTo(this.map);


    this.layerControls = L.control.layers(this.baseLayers, this.overlays);
    this.layerControls.addTo(this.map);
    this.baseLayers.底图.addTo(this.map);


    var LeafIcon = L.Icon.extend({
      options: {
        shadowUrl: 'assets/image/icon/leaf-shadow.png',
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
      }
    });
    var greenIcon = new LeafIcon({iconUrl: 'assets/image/icon/leaf-green.png'}),
      redIcon = new LeafIcon({iconUrl: 'assets/image/icon/leaf-red.png'}),
      orangeIcon = new LeafIcon({iconUrl: 'assets/image/icon/leaf-orange.png'});

    L.marker([31.231706, 121.472644], {icon: greenIcon}).addTo(this.map).bindPopup("I am a green leaf.");


    // L.marker([31.231706, 121.472644]).addTo(this.map)
    //   .bindPopup("<b>Hello Shanghai!</b>.").openPopup();


    this.search(1, 30, 14, 2000, 5000);
  }


  search(page, size, intervalDay, fromPrice, toPrice) {
    // console.log('click');
    this.http.post<HouseResponse>('https://woyaozufang.live/v2/houses', {
      "city": this.city,
      "source": this.source,
      "page": page,
      "size": size,
      "intervalDay": intervalDay,
      "rentType": null,
      "fromPrice": fromPrice,
      "toPrice": toPrice
    })
      .pipe(
        tap((houseResponse: HouseResponse) => {
          // console.log(data.data);

          if (houseResponse.success == false) {
            return;
          }
          console.log('检索出结果数目：'+ houseResponse.data.length)
          if (houseResponse.data.length == 0){
           return;
          }


          if (this.markerCluster == null) {

          } else {
            console.log('remove markerCluster ');
            this.map.removeLayer(this.markerCluster);
            this.layerControls.removeLayer(this.markerCluster);
          }


          this.markerCluster = L.markerClusterGroup();
          for (let item of houseResponse.data) {
            if (item.latitude === '' || item.latitude == null || item.longitude === '' || item.longitude == null) {
              continue;
            }

            let picUrlsString ="";
            let picUrlSJson = JSON.parse(item.picURLs); //可以将json字符串转换成json对象
            // console.log(picUrlSJson);
            for(let url of picUrlSJson){
              picUrlsString = picUrlsString + "<a   href=\"" +url + "\" target=\"_blank\">"+url+"</a>, "
            }

            let picturesString ="";
            for(let url of item.pictures){
              picturesString = picUrlsString + "<a   href=\"" +url + "\" target=\"_blank\">"+url+"</a>, "
            }


            let marker = L.marker(new L.LatLng(item.latitude, item.longitude),
              {title: item.title});
            marker.bindPopup("<h3>" + item.title + "</h3>"
              + item.text + "<br/>"
              // + picUrlsString + "<br/>"
              + item.location + "<br/>"
              + item.tags + "<br/>"
              + "发布时间：" + item.pubTime + "<br/>"
              + "<a   href=\"" +item.onlineURL + "\" target=\"_blank\">"+"原链接"+"</a>, " + "<br/>"
              // + "图片链接：" +  picturesString + "<br/>"
              + "价格："+ item.price + "<br/>"
              + "来源" + item.source);
            this.markerCluster.addLayer(marker);
          }

          this.layerControls.addOverlay(this.markerCluster, this.city + this.source);

          this.map.addLayer(this.markerCluster);

        })).subscribe();

  };

  public city: string = '上海';
  public source: string = 'douban';

  centerMap(e) {
    this.map.panTo(e.latlng);
  }
}
