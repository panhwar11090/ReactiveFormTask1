// form-validators.ts
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';

// Marks all controls in the form as touched

export function markAllControlsTouched(control: AbstractControl): void {
    if (control instanceof FormGroup) {
      // If it's a FormGroup, recursively mark each control as touched
      Object.values(control.controls).forEach((innerControl) => markAllControlsTouched(innerControl));
    } else if (control instanceof FormArray) {
      // If it's a FormArray, recursively mark each control in the array as touched
      control.controls.forEach((innerControl) => markAllControlsTouched(innerControl));
    } else {
      // If it's a FormControl, just mark it as touched
      control.markAsTouched();
    }
  }

// Retrieves all error messages with detailed field information
export function getFormErrors(formGroup: FormGroup, stores: { label: string }[]): string[] {
  const errors: string[] = [];
  const storeDetails = formGroup.get('storeDetails') as FormArray;

  storeDetails.controls.forEach((storeGroup, storeIndex) => {
    const storeName = stores[storeIndex].label;

    (storeGroup.get('items') as FormArray).controls.forEach((itemGroup, itemIndex) => {
      const sizeControl = itemGroup.get('size');
      const colorControl = itemGroup.get('color');
      const priceControl = itemGroup.get('price');

      if (sizeControl?.invalid) {
        errors.push(`Store: ${storeName}, Item ${itemIndex + 1} - Size is required`);
      }
      if (colorControl?.invalid) {
        errors.push(`Store: ${storeName}, Item ${itemIndex + 1} - Color is required`);
      }
      if (priceControl?.invalid) {
        errors.push(`Store: ${storeName}, Item ${itemIndex + 1} - Price is required`);
      }

      const seasonArray = itemGroup.get('seasonDetails') as FormArray;
      seasonArray.controls.forEach((seasonDetailGroup, seasonIndex) => {
        const seasonNameControl = seasonDetailGroup.get('seasonName');
        const seasonDetailControl = seasonDetailGroup.get('seasonDetail');

        if (seasonNameControl?.invalid) {
          errors.push(`Store: ${storeName}, Item ${itemIndex + 1}, Season ${seasonIndex + 1} - Season Name is required`);
        }
        if (seasonDetailControl?.invalid) {
          errors.push(`Store: ${storeName}, Item ${itemIndex + 1}, Season ${seasonIndex + 1} - Season Detail is required`);
        }
      });
    });
  });

  return errors;
}
