import { CookieService } from './../../../services/cookie.service';
import { FormValidations } from './../../../shared/form-validations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Teacher } from '../../../models/teacher';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ContractComponent } from '../../settings/contract/contract.component';
import { ChangeDetectorRef } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-teachers-view',
  templateUrl: './teachers-view.component.html',
  styleUrls: ['./teachers-view.component.scss'],
})
export class TeachersViewComponent implements OnInit {
  error: any | undefined;
  teachers$: Observable<Teacher[]> | undefined;
  public onClose: Subject<boolean>;
  public inicial = true;
  public teacher: Teacher;
  public teacherForm: FormGroup;
  public edit = false;
  public isFormValid = false;
  public showAlert = false;

  prefixoUrlTeacher =
    'https://20231-familymusicsystem-production.up.railway.app/api/teachers';
  public guardian = false;

  constructor(
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private http: HttpClient,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private cookieService: CookieService
  ) {}

  headers() {
    const jwt = this.cookieService.getCookie('jwt');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', `Bearer ${jwt}`);
    const opts = { headers: headers, params: { populate: '*' } };
    return opts;
  }

  ngOnInit(): void {
    this.teacherForm = this.fb.group({
      nameTeacher: [
        { value: this.teacher.Name, disabled: !this.edit },
        Validators.required,
      ],
      emailTeacher: [
        { value: this.teacher.Email, disabled: !this.edit },
        [Validators.required, Validators.email],
      ],
      phoneTeacher: [
        { value: this.teacher.Phone, disabled: !this.edit },
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
        ],
        ,
      ],
      cpfTeacher: [
        { value: this.teacher.CPF, disabled: !this.edit },
        [Validators.required, FormValidations.isValidCPF],
        ,
      ],
      rgTeacher: [
        { value: this.teacher.RG, disabled: !this.edit },
        Validators.required,
      ],

      genderTeacher: [
        { value: this.teacher.Gender, disabled: !this.edit },
        Validators.required,
      ],

      instrumentTeacher: [
        { value: this.teacher.Instruments, disabled: !this.edit },
        Validators.required,
      ],
    });
    this.cdr.detectChanges();
    this.teacherForm.updateValueAndValidity();
    this.teacherForm.statusChanges.subscribe(() => {
      this.isFormValid = this.teacherForm.valid;
    });
  }

  onEdit($teachers: Teacher): void {
    const teacher: Teacher = new Teacher();
    teacher.Name = this.teacherForm.get('nameTeacher')?.value;
    teacher.Email = this.teacherForm.get('emailTeacher')?.value;
    teacher.Phone = this.teacherForm.get('phoneTeacher')?.value;
    teacher.CPF = this.teacherForm.get('cpfTeacher')?.value;
    teacher.RG = this.teacherForm.get('rgTeacher')?.value;
    teacher.Gender = this.teacherForm.get('genderTeacher')?.value;
    teacher.Instruments = this.teacherForm.get('instrumentTeacher')?.value;

    const body = {
      data: teacher,
    };

    this.http
      .put(
        `https://20231-familymusicsystem-production.up.railway.app/api/teachers/${$teachers.id}`,
        body,
        this.headers()
      )
      .subscribe(
        (response) => {
          console.log(response);
          this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
          }, 3000);
        },
        (error) => {
          this.handleError(error);
        }
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.error = error.message;
    return of();
  }

  modalcontract() {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: false,
      initialState: {},
      class: 'modal-lg',
    };
    this.bsModalRef = this.modalService.show(ContractComponent, modalConfig);
    this.bsModalRef.content.onClose.subscribe(() => {});
  }

  scrollTop() {
    const div = document.getElementById('scroll');
    if (div !== null) {
      div.scrollTop = 0;
    }
  }

  Guardian() {
    this.inicial = false;
    this.guardian = true;
  }
  GuardianBack() {
    this.inicial = true;
    this.guardian = false;
  }

  sair() {
    this.bsModalRef.hide();
  }
}
