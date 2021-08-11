import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey     : string   = 'nBhqXxdpueCGeGen6ZdEJAmZHY0ZwpBa';/* LA API_KEY DE LA URL*/
  private servicioUrl: string   =  'https://api.giphy.com/v1/gifs'; /*AQUI LA URL DE LA WEB DE DONDE SACAMOS LOS GIF*/
  private _historial : string[] = [];
  

  public resultados: Gif [] = [];
  
  get historial() {
    return [...this._historial];
  }

  constructor( private http: HttpClient ) {

    this._historial = JSON.parse( localStorage.getItem('historial')!) || [];/* LAS LINEAS DE DEBAJO COMENTADAS SON LO MISMO QUE ESTA, SE USAN PARA QUE SE MUESTRE LO GUARDADO EN EL HISTORIAL DEL LOCAL STORAGE*/
    this.resultados = JSON.parse( localStorage.getItem('resultados')!) || [];/* CON ESA LINEA CONSEGUIMOS JUNTO CON LA QUE ESTA EN LA RESPUESTA, QUE AL RECARGAR EL NAVEGADOR, MANTENGAMOS LAS IMAGENES DE LA ULTIMA BUSQUEDA*/
    //if( localStorage.getItem('historial') ){
      //this._historial = JSON.parse( localStorage.getItem('historial')! );
    }

    buscarGifs( query: string) {

      query = query.trim().toLocaleUpperCase(); /* ESTA LINEA ASEGURA DE NO GUARDAR MISMO RESULTADOS EN HISTORIAL PERO CON MAYUSCULAS O MINUSCULAS*/
  
      if( !this._historial.includes( query )) { /* CON ESTA LINEA NOS ASEGURAMOS DE QUE NO SE REPITEN ELEMENTOS GUARDADOS EN EL HISTORIAL*/
          this._historial.unshift( query );
          this._historial = this._historial.splice(0,10); /* ESTA LINEA FUNCIONA IGUAL, LIMITA EL NUMERO DE GUARDADOS DEL HISTORIAL*/
  
          localStorage.setItem('historial', JSON.stringify( this._historial ) );/* ESTA LINEA GUARDAMOS EL HISTORIAL EN EL LOCAL STORAGE*/
      }

      const params = new HttpParams()/*AQUI CREAMOS LA CONST EN LA QUE GUARDAREMOS LOS PARAMETROS DE BUSQUEDA QUE QUERAMOS QUE SE USEN, ASI A LA HORA DE LLAMAR EL SERVICIO ESTA TODO MAS LIMPIO*/
              .set('api_key', this.apiKey)
              .set('limit', '30')
              .set('q', query);
  
      this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params })/*PENTICION A LA WEB PARA MOSTAR LOS GIFS USANDO LAS CONST PARAMS Y AÑADIENDO EN LA CLASS GIFSSERVICES LA URL DE LA WEB*/
      .subscribe( ( resp ) => {
        /*console.log( resp.data );*/
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify( this.resultados ) );/* ESTA LINEA, JUNTO CON LA QUE ESTA EN EL CONSTRUCTOR ES PARA MANTENER LA WEB CARGADA CON LA ULTIMA BUSQUEDA AUN QUE  REFRESQUEMOS EL NAVEGADOR*/
      });
  }

  
}
