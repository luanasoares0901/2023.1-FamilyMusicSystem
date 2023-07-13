import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { subYears, format } from 'date-fns';

@Component({
  selector: 'app-mural-filter',
  templateUrl: './mural-filter.component.html',
  styleUrls: ['./mural-filter.component.scss']
})
export class MuralFilterComponent implements OnInit{
  public onClose: Subject<any> = new Subject<any>();
  public edicao = false;
  public location = false;
  public inicial = true;
  public Resp = false;
  public numreq = 0;
  public muralFilterForm: FormGroup;

  constructor(private bsModalRef: BsModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.muralFilterForm = this.fb.group({
      createdAt: null,
    });
  }

  exit() {
    this.bsModalRef.hide();
  }

  filter() {
    const formValues = this.muralFilterForm.value;
    const filters = [];
    this.numreq = 0;

    if (formValues.createdAt !== null) {
      filters.push(`sort[${this.numreq}]=createdAt:${formValues.createdAt}`);
      this.numreq++;
    }

    const urlParams = filters.join("&");
    const url = `?${urlParams}`;

    this.onClose.next(url);
    this.bsModalRef.hide();
  }
}