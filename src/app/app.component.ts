import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';


import { HomePage } from '../pages/home/home';
import { MapPage }  from '../pages/map/map';
import {LoginPage} from '../pages/login/login';
import {ExplorePage} from "../pages/explore/explore";
import { SubmitDataPage } from '../pages/submit-data/submit-data';
import { EditSubmitDataPage } from '../pages/edit-submit-data/edit-submit-data';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) nav: Nav;

    rootPage: any = 'HomePage';

    pages: Array<{title: string, component: any}>;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            {title: 'Home', component: HomePage},
            {title: 'Admin', component: LoginPage},
            {title: 'Map', component: MapPage },
            {title: 'Explore', component: ExplorePage },
            {title: 'Submit Data', component: SubmitDataPage},
            {title: 'Edit Submit Data', component: EditSubmitDataPage},
        ];

    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }

}
