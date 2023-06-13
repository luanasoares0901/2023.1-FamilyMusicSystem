import { CookieService } from './../../../services/cookie.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, catchError, map, tap } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Lesson } from '../../../models/lesson';
import { Classroom } from '../../../models/classroom';
import { Teacher } from '../../../models/teacher';
import { Student } from '../../../models/student';

class Entry<T> {
  id: number;
  attributes: T;
}

class Response {
  data: Entry<Classroom>[];
}

class Response2 {
  data: Entry<Student>[];
}

class Response3 {
  data: Entry<Teacher>[];
}

@Component({
  selector: 'app-schedule-register',
  templateUrl: './schedule-register.component.html',
  styleUrls: ['./schedule-register.component.scss'],
})
export class ScheduleRegisterComponent implements OnInit {
  prefixoUrlRoom =
    'https://20231-familymusicsystem-production.up.railway.app/api/classrooms';

  prefixoUrlStudent =
    'https://20231-familymusicsystem-production.up.railway.app/api/students';

  prefixoUrlTeacher =
    'https://20231-familymusicsystem-production.up.railway.app/api/teachers';
  public onClose: Subject<boolean>;
  public edicao = false;
  public inicial = true;
  public guardian = false;
  public lesson: Lesson;
  public lessonForm: FormGroup;
  public valid: boolean = false;
  Rooms$: Observable<Classroom[]> | undefined;
  teachers$: Observable<Teacher[]> | undefined;
  students$: Observable<Student[]> | undefined;

  error: any | undefined;
  constructor(
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private http: HttpClient,
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
    this.lessonForm = this.fb.group({
      nameRoom: [null, Validators.required],
      nameTeacher: [null, [Validators.required, Validators.email]],
      date: [null, [Validators.required]],
      nameStudent: [null, Validators.required],
    });

    this.getStudent();
    this.getTeacher();
    this.getRoom();
  }

  onSubmit(): void {
    const lesson: Lesson = new Lesson();
    lesson.Student = this.lessonForm.get('nameStudent')?.value;
    lesson.Teacher = this.lessonForm.get('nameTeacher')?.value;
    lesson.Classroom = this.lessonForm.get('nameRoom')?.value;
    lesson.Horary = this.lessonForm.get('date')?.value;
    const body = {
      data: lesson,
    };

    this.http
      .post(
        'https://20231-familymusicsystem-production.up.railway.app/api/lessons',
        body,
        this.headers()
      )
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          this.handleError(error);
        }
      );
  }

  getRoom(args?: string) {
    this.Rooms$ = this.http
      .get<Response>(
        args ? `${this.prefixoUrlRoom}${args}` : this.prefixoUrlRoom,
        this.headers()
      )
      .pipe(
        catchError((error) => this.handleError(error)),
        tap((response: Response) => {
          response.data.forEach((room) => {
            room.attributes.id = room.id;
          });
        }),
        map((response: Response) =>
          response.data.map((room) => room.attributes)
        )
      );
  }

  getStudent(args?: string) {
    this.students$ = this.http
      .get<Response2>(
        args ? `${this.prefixoUrlStudent}${args}` : this.prefixoUrlStudent,
        this.headers()
      )
      .pipe(
        catchError((error) => this.handleError(error)),
        tap((response: Response2) => {
          response.data.forEach((student) => {
            student.attributes.id = student.id;
          });
        }),
        map((response: Response2) =>
          response.data.map((student) => student.attributes)
        )
      );
  }

  getTeacher(args?: string) {
    this.teachers$ = this.http
      .get<Response3>(
        args ? `${this.prefixoUrlTeacher}${args}` : this.prefixoUrlTeacher,
        this.headers()
      )
      .pipe(
        catchError((error) => this.handleError(error)),
        tap((response: Response3) => {
          response.data.forEach((teacher) => {
            teacher.attributes.id = teacher.id;
          });
        }),
        map((response: Response3) =>
          response.data.map((teacher) => teacher.attributes)
        )
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.error = error.message;
    return of();
  }

  sair() {
    this.bsModalRef.hide();
  }
}
