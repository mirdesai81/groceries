import {FormControl, FormGroup,Validators,FormArray} from '@angular/forms';
import * as _ from 'lodash';
export class FormUpdate {

  constructor() {

  }

  initFormGroup(form: FormGroup, data: any) {
    for(var key in form.controls) {
      console.log(key);
      if(form.controls[key] instanceof FormControl) {
        if(data[key]){
          let control = <FormControl>form.controls[key];
          this.initFormControl(control,data[key]);
        }
      } else if(form.controls[key] instanceof FormGroup) {
        if(data[key]){
          this.initFormGroup(<FormGroup>form.controls[key],data[key]);
        }
      } else if(form.controls[key] instanceof FormArray) {
        var control = <FormArray>form.controls[key];
        if(data[key])
          this.initFormArray(control, data[key]);
      }
    }
  }
  initFormArray(array: FormArray, data: Array<any>){
    if(data.length>0){
      var clone = array.controls[0];
      array.removeAt(0);
      for(var idx in data) {
        array.push(_.cloneDeep(clone));
        if(clone instanceof FormGroup)
          this.initFormGroup(<FormGroup>array.controls[idx], data[idx]);
        else if(clone instanceof FormControl)
          this.initFormControl(<FormControl>array.controls[idx], data[idx]);
        else if(clone instanceof FormArray)
          this.initFormArray(<FormArray>array.controls[idx], data[idx]);
      }
    }
  }


  initFormControl(control: FormControl, value:any){
    control.patchValue(value);
  }
}
