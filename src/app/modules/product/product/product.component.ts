import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { ProductService } from '../../shared/services/product.service';
import { NewProductComponent } from '../new-product/new-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private productService: ProductService,  public dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getProducts();
  }

  displayedColumns: string[] = ['id', 'name', 'price', 'account', 'category', 'picture',  'actions'];
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getProducts(){
    this.productService.getProducts()
        .subscribe( (data:any) => {
          console.log("respuesta de productos: ", data);
          this.processProductResponse(data);
        }, (error: any) => {
          console.log("error en productos: ", error);
        }) 
  }

  processProductResponse(resp: any){
    const dateProduct: ProductElement[] = [];
     if( resp.metadata[0].code == "00"){
       let listCProduct = resp.product.products;

       listCProduct.forEach((element: ProductElement) => {
         //element.category = element.category.name;
         element.picture = 'data:image/jpeg;base64,'+element.picture;
         dateProduct.push(element);
       });

       //set the datasource
       this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
       this.dataSource.paginator = this.paginator;
     }
  }

  openProductDialog(){
    const dialogRef = this.dialog.open( NewProductComponent , {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if(result == 1){
        this.openSnackBar("Producto Agregado", "Exitosa");
        this.getProducts();
      } else if (result == 2){
        this.openSnackBar("Se produjo un error al guardar el producto", "Error")
      }

    });
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar>{

    return this.snackBar.open(message, action, {
      duration: 2000
    })
  }

  edit(id: number, name: string, price: number, account: number, category: any){

    const dialogRef = this.dialog.open( NewProductComponent , {
      width: '450px',
      data: {id: id, name: name, price: price, account: account, category: category}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if(result == 1){
        this.openSnackBar("Producto Editado", "Exitosa");
        this.getProducts();
      } else if (result == 2){
        this.openSnackBar("Se produjo un error al editar el producto", "Error")
      }

    });
  }

  deletep(id: any){
    const dialogRef = this.dialog.open( ConfirmComponent , {
      data: {id: id, module: "product"}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if(result == 1){
        this.openSnackBar("Producto Eliminado", "Exitosa");
        this.getProducts();
      } else if (result == 2){
        this.openSnackBar("Se produjo un error al eliminar el producto", "Error")
      }

    });
  }

  buscar(name: string){

    if(name.length === 0){
      this.productService.getProducts()
              .subscribe( (resp: any) => {
                this.processProductResponse(resp)
              } )
    } else {
      this.productService.getProductsByName(name)
              .subscribe( (resp: any) => {
                this.processProductResponse(resp)
              } )
    }
  }

}

export interface ProductElement {
  id: number;
  name: string;
  price: number;
  account: number;
  category: any;
  picture: any;
}

