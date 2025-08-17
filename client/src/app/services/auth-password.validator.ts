import { AbstractControl } from "@angular/forms";

export function passwordValidator(control: AbstractControl): 
  { [key: string]: boolean} | null {
  const value = control.value as string;
  // check for min 10 and max 18 length, plus at least two each of upper and 
  // lower case and numbers.  Special characters aren't checked.
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '1234567890';
  let lowerCount = 0;
  let upperCount = 0;
  let numberCount = 0;
  for (let i=0; i < value.length; i++) {
    const chr = value.substring(i, i+1);
    if (lowerCase.includes(chr)) {
      lowerCount++;
    } else if (upperCase.includes(chr)) {
      upperCount++;
    } else if (numbers.includes(chr)) {
      numberCount++;
    }
  }
  if (lowerCount < 2 || upperCount < 2 || numberCount < 2) {
    return { 'password': true };
  }
  return null;
}

export function mustMatchValidator(control: AbstractControl):
  { [key: string]: boolean} | null {
    if (control.parent) {
      const passwd = control.parent.get('password')?.value;
      const verify = control.value;
      if (passwd !== verify) {
        return { 'match': true };
      }
    }
    return null;
}