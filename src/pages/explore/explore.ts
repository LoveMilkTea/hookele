import { Component, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { MapPage } from "../map/map";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var google;

@IonicPage()
@Component({
    selector: 'page-explore',
    templateUrl: 'explore.html',
})

@Injectable()
export class ExplorePage {
    currentLat: any;
    currentLng: any;
    dist: Array<any> = [];
    dur: Array<any> = [];
    loader: any;
    service = new google.maps.DistanceMatrixService();
    current: any;
    wrc = new google.maps.LatLng(21.2989380, -157.8185730);
    cc = new google.maps.LatLng(21.2984350, -157.8188780);
    hamilton = new google.maps.LatLng(21.3004500, -157.8161520);
    stanSheriff = new google.maps.LatLng(21.2943550, -157.8186020);
    kennedy = new google.maps.LatLng(21.2993160, -157.8150410);
    paradisePalms = new google.maps.LatLng(21.3008300, -157.8156720);
    qlc = new google.maps.LatLng(21.3001970, -157.8183760);
    sinclair = new google.maps.LatLng(21.2984860, -157.8201670);
    uhs = new google.maps.LatLng(21.2983360, -157.8152250);

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loading: LoadingController) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.currentLat = position.coords.latitude;
                this.currentLng = position.coords.longitude;
                this.current = new google.maps.LatLng(this.currentLat, this.currentLng);
            })
            this.showLoading();
        }
        else {
            alert('Location blocked, please try again.')
        }
    }

    /**************** DIRECTIONAL FUNCTIONS ****************/


    /*
     * Directs towards the selected location
     * @param {int} value - Location index of the selected location to direct towards
     * @return none
     */

    mapTo(value) {
        console.log(value + ' mapto');
        this.navCtrl.push(MapPage, {
            locationIndex: value.toString(),
            currentLat: this.currentLat,
            currentLng: this.currentLng
        });
    }

    /*
     * Shows the location of the selected location
     * @param {int} value - Location index of the selected location
     * @return none
     */

    showLocation(value) {
        console.log(value + ' showloc')
        this.navCtrl.push(MapPage, {
            locationIndex2: value,
            currentLat: this.currentLat,
            currentLng: this.currentLng
        });
    }

    /*
     * Checks if the application has access to the users current location to calculate the distance
     *  from the point of interest
     * @param none
     * @return true - If users current location is accessible
     * @return false - If users current location is inaccessible
     */

    hasCurrLocation() {
        if (this.current) {
            return true;
        }
        else {
            return false;
        }
    }

    /**************** DISTANCE / DURATION FUNCTIONS ****************/

    /*
     * Gets the users distance and duration to the locations on the explore page
     * @param none
     * @return none
     */

    findDistanceAndDuration() {
        setTimeout(() => {
            this.service.getDistanceMatrix({
                    origins: [this.current],
                    destinations: [this.wrc, this.cc, this.hamilton, this.stanSheriff, this.kennedy, this.paradisePalms, this.qlc, this.sinclair, this.uhs],
                    travelMode: google.maps.TravelMode.WALKING,
                    unitSystem: google.maps.UnitSystem.IMPERIAL,
                    durationInTraffic: false,
                    avoidHighways: false,
                    avoidTolls: false
                },
                (response, status) => {
                    if (status !== google.maps.DistanceMatrixStatus.OK) {
                        console.log('Error:', status);
                    } else {
                        this.loadDistanceAndDuration(response);
                    }
                });
            this.hideLoading();
        }, 5000);
    }

    /*
     * Uses user's current location to load distance to destination
     *  and estimated time to get there
     *  @param {object} data - Distance and location being returned
     *  @return none
     */

    loadDistanceAndDuration(data) {
        console.log(data + ' loadDnD')
        var length = data.rows[0].elements.length;
        for (var i = 0; i < length; i++) {
            this.dist.push("(" + data.rows[0].elements[i].distance.text + ")");
            this.dur.push(data.rows[0].elements[i].duration.text);
        }
    }

    /**************** LOADING ANIMATION FUNCTIONS ****************/

    /*
     * Loads the loader animation and gets the distance and duraition to locations
     * @param none
     * @return none
     */

    private showLoading() {
        this.loader = this.loading.create({
            content: "Calculating..."
        });
        this.loader.present();
        this.findDistanceAndDuration();
    }

    /*
     * Dismisses the loader animation
     * @param none
     * @return none
     */

    private hideLoading(){
        this.loader.dismiss().catch(() => {});
    }

}
