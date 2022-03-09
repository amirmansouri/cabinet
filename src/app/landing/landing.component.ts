import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../doctor/doctor.service';
import { SecretaryService } from '../secretary/secretary.service';
import { AdminService } from '../admin/admin.service';

declare var $: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private router: Router, private doctor: DoctorService, private sec: SecretaryService, private admin: AdminService) { }

  emailAdmin = 'admin@cabinet.tn';
  passwordAdmin = 'admin';
  alertMessageAdmin = '';
  alertMessageDoctor = '';
  alertEmailExistDoctor = '';
  alertEmailSecretary = '';
  ngOnInit(): void {
  }

  onSubmitAdmin(f: NgForm) {
    if (f.value.emailAdmin != this.emailAdmin) {
      this.alertMessageAdmin = 'Email est incorrecte';
    } else if (f.value.passwordAdmin != this.passwordAdmin) {
      this.alertMessageAdmin = 'Mot de passe est incorrecte';
    } else {
      $('#LoginAdmin').modal('hide');
      this.router.navigate(['admin/dashboard']);
    }
  }

  ////////////////////////////////////////////////DOC auth
  onSubmitDoctor(f: NgForm) {
    this.doctor.LoginDoctor(f.value).subscribe((data: any) => {
      if (data._id != undefined) {
        $('#LoginDoctor').modal('hide');
        localStorage.setItem('doctor', JSON.stringify(data));
        this.router.navigate(['doctor/secretaries/']);
      } else {
        this.alertMessageDoctor = data;
      }
    })
  }

  onSubmitDoctorRegister(f: NgForm) {
    this.admin.checkExistEmail(f.value).subscribe((data: any) => {
      if (data.doc) {
        this.alertEmailExistDoctor = 'Email existant';
      } else {
        this.doctor.RegisterDoctor(f.value).subscribe((data: any) => {
          if (data._id != undefined) {
            $('#RegisterDoctor').modal('hide');
            localStorage.setItem('doctor', JSON.stringify(data));
            this.router.navigate(['doctor/secretaries/']);
          } else {
            this.alertMessageDoctor = data;
          }
        })
      }
    });

  }


  ////////////////////////////////////////////////SECR auth
  onSubmitSec(f: NgForm) {
    this.sec.loginSec(f.value).subscribe((data: any) => {
      if (data._id != undefined) {
        $('#LoginSec').modal('hide');
        localStorage.setItem('secretary', JSON.stringify(data));
        this.router.navigate(['secretary/home/' + data._id]);
      } else {
        this.alertMessageDoctor = data;
      }
    })
  }

  onSubmitSecRegister(f: NgForm) {
    this.admin.checkExistEmail(f.value).subscribe((data: any) => {
      if (data.secretary) {
        this.alertEmailSecretary = 'Email existant';
      } else {
        this.sec.RegisterSec(f.value).subscribe((data: any) => {
          if (data._id != undefined) {
            $('#RegisterSec').modal('hide');
            localStorage.setItem('secretary', JSON.stringify(data));
            this.router.navigate(['secretary/home/' + data._id]);
          } else {
            this.alertMessageDoctor = data;
          }
        })
      }
    });

  }



}
