import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';
import * as _ from 'underscore/underscore';
import {AuthProvider} from "../../providers/auth/auth";
import { LoginPage } from '../login/login';
import {FirebaseProvider} from "../../providers/firebase/firebase";

@IonicPage()
@Component({
    selector: 'points-page',
    templateUrl: 'points.html'
})

export class PointsPage {
    @ViewChild('commentText') commentText;
    name: any;
    address: any;
    number: any;
    description: any;
    key: any;
    public comments: any[];
    image: any;
    date: any;
    showAdd: any;
    user: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, private toast: ToastController, public authData: AuthProvider, public database: FirebaseProvider) {

        this.name = this.navParams.get('name');
        this.address = this.navParams.get('address');
        this.number = this.navParams.get('number');
        this.description = this.navParams.get('description');
        this.key = String(this.navParams.get('key'));
        if (this.navParams.get('key') > 163) {
            this.image =  "../../assets/images/uhLogo.jpg";
        } else {
            if (!isNaN(this.navParams.get('key'))) {
                this.image = "https://manoanow.org/app/map/images/" + this.key + ".png";
            } else {
                this.image = "../../assets/images/uhLogo.jpg";
            }
        }
        this.date = new Date();
        this.showAdd = false;
        this.user = firebase.auth().currentUser;
        }

    ionViewDidLoad() {
      this.showComments();
    }

    /***************** PAGE LOAD FUNCTION ****************/

    /**
     *  Loads all of the user comments for the particular point
     *  @param none
     *  @return none
     */

    showComments() {
        var item = [];
        this.database.masterData.child(this.key).child("comments").once("value")
            .then((dataPoints) => {
                item = dataPoints.val();
                this.comments = _.toArray(item);
        });

    }

    /***************** COMMENTS FUNCTION ****************/

    /**
     *  Takes data from the leave comments form and places it into the master data firebase db
     *  @param {Object} - NgForm data
     *  @return none
     */
    addComments(formData: NgForm){
        if(this.user) {
            this.date = new Date().toString();
            Object.assign(formData.value, {'dateTime': this.date});
            Object.assign(formData.value, {'userName': this.user.displayName});
            let comments = this.database.masterData.child(this.key);
            comments.child('/comments').push(formData.value);
            this.showComments();
            this.toggleAddButton();
            this.commentText.value = "";
        }
    }

    /***************** TOGGLE COMMENTS FUNCTION ****************/

    /**
     *  Allows the user to hide the comments
     *  @param none
     *  @return none
     */
    toggleAddButton() {
        this.showAdd = !this.showAdd;
    }

    /***************** GET CURRENT DATE/TIME FUNCTION ****************/

    /**
     *  When a user submits a comments, this function gets the current data so it can be associated with the
     *  @param none
     *  @return {Date Object} - The current date
     */
    getDate(comment: any) {
        return new Date(comment.dateTime).getMonth() + 1 + '/' + new Date(comment.dateTime).getDate() + '/' + new Date(comment.dateTime).getFullYear()
    }

    /***************** DIRECT TO LOGIN FUNCTION ****************/

    /**
     *  A user can only comment if they are logged in, this directs a non-logged in user to the login page
     *  @param none
     *  @return none
     */
    logIn(){
        this.navCtrl.push(LoginPage);
    }

}
