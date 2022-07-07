import React, { useState } from "react";                    //Importamos biblioteca de react
import * as XLSX from "xlsx";                               //Importamos biblioteca para manejo de archivos en excel

class ExcelToJson extends React.Component {                 //Definimos clase principal (ExcelToJson) que hereda de React.Component
  constructor(props) {                                      //Definimos el constructor pasando como parámetro 'props'
    super(props);                                           //Se heredan las propiedades 
    this.handleClick = this.handleClick.bind(this);         //Creamos handleClick
    this.state = {                                          //Creamos el estado
      file: "",                                             //Se inicializa file dentro del estado
    };
    this.datosJSON = []                                     //Declaramos datosJSON para hacerla global
  }

  handleClick(e) {                                          //Definición de la función handleClick, pasando 'e' como parámetro
    this.refs.fileUploader.click();                         //Se actualiza el archivo al hacer click
  }

  filePathset(e) {                                          //Función para definir las rutas de archivo
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];
    this.setState({ file });                                                  //Actualizamos el estado con el archivo subido
  }

  readFile() {                                                                //Función para leer el archivo
    var f = this.state.file;
    var name = f.name;
    console.log("ESTADO: >>>", name)                                          //Imprimimos en pantalla el estado actualizado
    
    const reader = new FileReader();                                          //Se crea una nueva constante 'reader', instancia de FileReader
    reader.onload = (evt) => {                                                //Definimos las acciones durante la carga del archivo
  
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
                         
      const wsname = wb.SheetNames[0];                                        //Obtenemos la primer hoja de cálculo
      const ws = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });                //Guardamos dentro de 'data' los datos del excel el arreglo de arreglos
 
      console.log("DATOS TEXTO PLANO: >>>" + data);                           //Mostramos en consola los datos recopilados del excel en texto plano (antes de la conversión a JSON)
      console.log("DATOS EN FORMATO JSON: >>>" + this.convertToJson(data));     //Mostramos en consola los datos convertidos al formato JSON (obtenido de la función 'convertToJson')
    };
    reader.readAsBinaryString(f);
  }

  convertToJson(csv) {                                                          //Función para convertir a formato JSON
    var lines = csv.split("\n");                                                //Utilizamos 'split' para hacer la separación de líneas del nuevo formato

    var result = [];                                                            //Inicializamos el arreglo 'result' para guardar la conversión al final de la función

    var headers = lines[0].split(",");                                          //Definimos el arreglo de las cabeceras del archivo separados por una coma

    for (var i = 1; i < lines.length; i++) {                                    //Recorremos el arreglo de para mostrar el contenido uno a uno
      var obj = {};           
      var currentline = lines[i].split(",");                                    //Se realiza la separación de líneas una a una con .split recorriendo el arreglo 'lineas'

      for (var j = 0; j < headers.length; j++) {                                //Anidamos un for para hacer el recorrido de las cabeceras
        obj[headers[j]] = currentline[j];                                       //Se guarda en el arreglo obj la cabecera correspondiente a la línea actual
        console.log("NUEVO ELEMENTO AGREGADO: >>>" + obj)                       //Mostramos en pantalla los nuevos elementos agregados durante cada iteración
      }

      result.push(obj);                                                         //Al finalizar cada iteración de las nuevas líneas, se almacena en el arreglo 'result' el objeto creado en el segundo ciclo for
    }
    
    this.datosJSON = JSON.stringify(result);                                    //Definimos una constante datosJSON para guardar los datos convertidos a JSON para su posterior uso
    console.log("*********************")
    console.log("*********************")
    console.log("DATOS CONVERTIDOS A FORMATO JSON: >>>" + this.datosJSON )
    console.log("*********************")
    console.log("*********************")
  

    console.log("INICIA DESCARGA DE ARCHIVO EN FORMATO JSON...")
    var hiddenElement = document.createElement('a')                             //Crea un elemento para ser almacenado dentro del documento
    hiddenElement.href ="data://attachment/js,"+ encodeURI(this.datosJSON);          //Obtiene la ruta del archivo JSON 
    hiddenElement.download ='datosJSON.js'                                      //Le asigna el nombre y descarga
    hiddenElement.click() 

    return this.datosJSON;
    
  }

  render() {
    return (
      <div>
        <input
          type="file"
          id="file"
          ref="fileUploader"
          onChange={this.filePathset.bind(this)}
        />
        <button
          onClick={() => {
            this.readFile();
          }}
        >
          Descargar JSON
        </button>
        
      </div>
    );
  }
}

export default ExcelToJson;