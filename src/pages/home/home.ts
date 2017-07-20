import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DeviceMotion } from '@ionic-native/device-motion';
import { IonicPage, Platform } from 'ionic-angular';
import { DrinkProvider } from '../../providers/drink/drink';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  stars: any[] = [];

  lastX: number;
  lastY: number;
  lastZ: number;
  moveCounter: number = 0;

  constructor(public storage: Storage, public drinkProvider: DrinkProvider, public platform: Platform, public deviceMotion: DeviceMotion) { }

  ionViewWillEnter() {
    this.stars = [];
    this.storage
      .get('STARS')
      .then(res => {
        res = res || []
        res.forEach(element => {
          this.drinkProvider
            .getDrinkById(element)
            .subscribe(res => this.stars.push(res))
        });
      })
  }

  ionViewDidLoad() {
    if (this.platform.is('cordova')) {
      this.platform
        .ready()
        .then(() => {
          this.deviceMotion.watchAcceleration({ frequency: 200 }).subscribe(acc => {
            if (!this.lastX) {
              this.lastX = acc.x;
              this.lastY = acc.y;
              this.lastZ = acc.z;
              return;
            }

            let deltaX: number, deltaY: number, deltaZ: number;
            deltaX = Math.abs(acc.x - this.lastX);
            deltaY = Math.abs(acc.y - this.lastY);
            deltaZ = Math.abs(acc.z - this.lastZ);

            if (deltaX + deltaY + deltaZ > 3) {
              this.moveCounter++;
            } else {
              this.moveCounter = Math.max(0, --this.moveCounter);
            }

            if (this.moveCounter > 2) {
              this.navigateToRandomDrink();
              this.moveCounter = 0;
            }

            this.lastX = acc.x;
            this.lastY = acc.y;
            this.lastZ = acc.z;
          })
        })
    }
  }

  navigateToRandomDrink() {

  }
}
