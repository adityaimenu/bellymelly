import { Injectable } from '@angular/core';
import * as geolib from 'geolib';
import * as geoDist from 'geodist';

@Injectable({
  providedIn: 'root'
})
export class LocationServiceService {

  constructor() { }
  getDeliveryPrice(currentLocation, zone) {
    const result = [];
    return new Promise((done, reject) => {
      if (zone.DeliveryZones) {
        zone.DeliveryZones.forEach(ele => {
          const output = [];
          if (!result.length) {
            let str = ele.PointString;
            str = str.split(',0,');
            str.forEach(element => {
              const part = element.split(',');
              output.push({latitude: Number(part[0]), longitude: Number(part[1])});
            });
            if (geolib.isPointInPolygon(currentLocation, output)) result.push(ele);
          }
        });
        return done(result);
      } else {
        return done([]);
      }
    });
  }
  getDistance(payload, restAdd) {
    return new Promise((done, reject) => {
      return done(geoDist(payload, restAdd, {exact: true, unit: 'km'}));
    });
  }
}
