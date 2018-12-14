import {Injectable, OnInit} from '@angular/core';
import {Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs/internal/operators";

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


    function showCoordinates(e) {
      alert(e.latlng);
    }


    function zoomIn(e) {
      this.map.zoomIn();
    }

    function zoomOut(e) {
      this.map.zoomOut();
    }

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
        callback: this.centerMap
      }, '-', {
        text: 'Zoom in',
        icon: 'images/zoom-in.png',
        callback: zoomIn
      }, {
        text: 'Zoom out',
        icon: 'images/zoom-out.png',
        callback: zoomOut
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

    // L.marker([31.231706, 121.472644]).addTo(this.map)
    //   .bindPopup("<b>Hello Shanghai!</b>.").openPopup();


    this.search(1, 30, 14, 2000, 5000);
  }


  search(page, size, intervalDay, fromPrice, toPrice) {
    console.log('click');
    this.http.post('https://woyaozufang.live/v2/houses', {
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
        tap(data => {
          // console.log(data.data);

          if(this.markerCluster == null){

          }else {
            console.log('remove markerCluster ');
            this.map.removeLayer(this.markerCluster);
            this.layerControls.removeLayer(this.markerCluster );
          }


          let array = data['data'];
          // console.log(array.length);
          this.markerCluster = L.markerClusterGroup();
          for (let item of array) {
            if (item.latitude === '' || item.latitude == null || item.longitude === '' || item.longitude == null) {
              continue;
            }

            let marker = L.marker(new L.LatLng(item.latitude, item.longitude),
              {title: "<h1>"+item.title+"</h1>" + item.text + ''+ item.location+item.pubTime});
            marker.bindPopup(item.title);
            this.markerCluster .addLayer(marker);
          }

          this.layerControls.addOverlay(this.markerCluster,this.city+this.source );

          this.map.addLayer(this.markerCluster );

        })).subscribe();

  };

  public city: string = '上海';
  public source: string = 'douban';

  centerMap(e) {
    this.map.panTo(e.latlng);
  }
}
