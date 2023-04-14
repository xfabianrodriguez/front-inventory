import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

   /**
   * get all products 
   */
   getProducts(){  
    const endpoint = `${base_url}/products`;
    return this.http.get(endpoint);
  }

    /**
   * save the categories
   */
    saveProducts(body: any){
      const endpoint = `${base_url}/products`;
      return this.http.post(endpoint, body)
    }

      /**
   * update the products
   */
  updateProduct(body: any, id: any){
    const endpoint = `${base_url}/products/${id}`;
    return this.http.put(endpoint, body)
  }

  /**
   * delete the products
   */
  deleteProduct(id: any){
    const endpoint = `${base_url}/products/${id}`;
    return this.http.delete(endpoint)
  }

     /**
   * get products by name
   */
     getProductsByName(name: any){
      const endpoint = `${base_url}/products/filter/${name}`;
      return this.http.get(endpoint)
    }

  /**
   * export excel services
   */
   exportProducts(){
    const endpoint = `${base_url}/products/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    })
  }
}
