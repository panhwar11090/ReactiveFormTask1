import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators , FormControl, FormsModule} from '@angular/forms';
import { markAllControlsTouched,getFormErrors } from './Validators/form-validators';
import { RouterOutlet } from '@angular/router';
import { CLIENT_RENEG_LIMIT } from 'tls';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  storeForm!: FormGroup;
  selectedStore!: string;
  selectedStoreIndex!: number;
 

  stores = [
    { value: 'ndure', label: 'Ndure' },
    { value: 'gul_ahmed', label: 'Gul Ahmed' }
  ];

  private storeData: { [key: string]: any[] } = { ndure: [], gul_ahmed: [] };
  cdRef: any;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.storeForm = this.fb.group({
      store: ['', Validators.required],
      storeDetails: this.fb.array(this.stores.map((x) => this.createStoreDetail(x.value)))
    });

  }

  createStoreDetail(x: string): FormGroup {
    return this.fb.group({
      storeName: [x],
      items: this.fb.array([this.createItemForm()]) // Empty items array for each store initially
    });
  }

  // this is the formGropu in which we add details of items
  createItemForm(): FormGroup {
    return this.fb.group({
      size: ['', Validators.required],
      color: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      // season: this.fb.array([false]) ,
      season: [false],
      seasonDetails : this.fb.array([])
    });
  }

  // Nested Group which will open on checkbox selection
  createSeasonDetails(): FormGroup{
    return this.fb.group({
      seasonName:['', Validators.required],
      seasonDetail:['', Validators.required]
    })
  }

  get storeDetails(): FormArray {
    return this.storeForm.get('storeDetails') as FormArray;
  }

  getItems(storeIndex: number): FormArray {
    return this.storeDetails.at(storeIndex).get('items') as FormArray;
  }

  getSeasonDetails(itemIndex: number, storeIndex: number): FormArray {
    return this.getItems(storeIndex).at(itemIndex).get('seasonDetails') as FormArray;
  }


  // this logic will work when we change the store from drop down selection
  onStoreChange(storeChangeEvent: Event): void {
    const input = storeChangeEvent.target as HTMLInputElement; 
    this.selectedStoreIndex = this.stores.findIndex(x => x.value == input.value);
  }

  // this the logic fro checkbox of season
  toggleSession(itemIndex: number, storeIndex: number): void{
    const item = this.getItems(storeIndex).at(itemIndex);
    const seasonArray = this.getSeasonDetails(itemIndex, storeIndex);

    if (item.get('season')?.value) {
      // If season is true, add a new season detail form
      seasonArray.push(this.createSeasonDetails());
    } else {
      // If season is false, clear the season detail forms
      while (seasonArray.length !== 0) {
        seasonArray.removeAt(0);
      }
    }

  }

  addSeasonDetail(itemIndex: number, storeIndex: number): void {
    this.getSeasonDetails(itemIndex, storeIndex).push(this.createSeasonDetails());
  }

  removeSeasonDetail(itemIndex: number, storeIndex: number, seasonIndex: number): void {
    this.getSeasonDetails(itemIndex, storeIndex).removeAt(seasonIndex);
  }

  addItem(storeIndex: number): void {
    const itemsArray = this.getItems(storeIndex);
    itemsArray.push(this.createItemForm());
  }

  removeItem(storeIndex: number, itemIndex: number): void {
    this.getItems(storeIndex).removeAt(itemIndex);
  }


  private markAllControlsTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllControlsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  submitForm() {
    if (this.storeForm.invalid) {
      markAllControlsTouched(this.storeForm); // Mark all fields as touched
      const errorMessages = getFormErrors(this.storeForm, this.stores); // Collect error messages
      alert('Please fill in all required fields:\n' + errorMessages.join('\n'));
      return;
    }

    console.log('Form submitted:', this.storeForm.value);
  }

  logFormData(): void {
    console.log('Current Form Data:', this.storeForm.value);
  }
}