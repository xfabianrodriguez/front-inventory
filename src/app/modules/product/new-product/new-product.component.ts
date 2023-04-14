import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';

export interface Category{
  description: string;
  id: number;
  name: string;
}

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  public productForm: FormGroup;
  estadoFormulario: string = "";
  categories: Category[]=[];
  selectecFile: any;
  nameImg: string = "";

  constructor(private fb: FormBuilder, private categoryService: CategoryService,
    private productService: ProductService, private dialogRef: MatDialogRef<NewProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.estadoFormulario = "Agregar";
      this.productForm = this.fb.group({
        name: ['', Validators.required],
        price: ['', Validators.required],
        account: ['', Validators.required],
        category: ['', Validators.required],
        picture: ['', Validators.required]
      })

      if(data != null){
        this.updateForm(data);
        this.estadoFormulario = "Actualizar"
      }

    }

  ngOnInit(): void {
    this.getCategories();
  }

  onSave(){
    let data = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      account: this.productForm.get('account')?.value,
      category: this.productForm.get('category')?.value,
      picture: this.selectecFile
    }

    const uploadImageData = new FormData();
    uploadImageData.append('picture', data.picture, data.picture.name);
    uploadImageData.append('name', data.name);
    uploadImageData.append('price', data.price);
    uploadImageData.append('account', data.account);
    uploadImageData.append('categoryId', data.category);

    if(this.data != null){
      //update product
      this.productService.updateProduct(uploadImageData, this.data.id)
              .subscribe((data: any) =>{
                this.dialogRef.close(1);
              }, (error: any) => {
                this.dialogRef.close(2);
              })

    } else {
      //create new product
      this.productService.saveProducts(uploadImageData)
            .subscribe((data: any) => {
              this.dialogRef.close(1);
            }, (error: any) => {
              this.dialogRef.close(2);
            })
    }  
  }

  onCancel(){
    this.dialogRef.close(3);
  }

  getCategories(){
    this.categoryService.getCategories()
        .subscribe( (data: any) =>{
          this.categories = data.categoryResponse.category;
        }, (error: any) =>{
          console.log("error al consultar categorias");
        })
  }

  onFileChanged(event: any){
    this.selectecFile = event.target.files[0];
    console.log(this.selectecFile);

    this.nameImg = event.target.files[0].name;
  }

  updateForm(data: any){
    this.productForm = this.fb.group({
        name: [data.name, Validators.required],
        price: [data.price, Validators.required],
        account: [data.account, Validators.required],
        category: [data.category.id, Validators.required],
        picture: ['', Validators.required]
    });
  }

}
