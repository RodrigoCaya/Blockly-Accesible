const manualBtn = document.getElementById("manualBtn");
const tutorialBtn = document.getElementById("tutorialBtn");
const home = document.getElementById("home");
const instructionsTutorial = document.getElementById("instructionsTutorial");
const selection = document.getElementById("selection");
const manual = `
    <p style="font-size: 24px; font-weight: bold;"> Manual de uso de Blockly Accesible </p>
    <p>
      Esta es una nueva ventana del navegador, si quieres cambiar de ventana puedes presionar Alt + Tab, y si quieres cerrar esta ventana puedes presionar Control + W.
    </p>  
    <p>
    Este programa, que corre en el navegador web, permite crear programas sin escribir código.
    </p>
    <p>
      Blockly Accesible esta diseñado para lectores de pantalla, optimizada para el lector NVDA y probada en el navegador Google Chrome, 
      que utiliza de base el programa Blockly creado por Google y MIT. 
      Esto permite a los usuarios con discapacidad visual crear programas utilizando el teclado.
    </p>
    <p>
      Los programas se crean dentro del espacio de trabajo utilizando bloques de código.
    </p>
    <p>
      Para utilizar Blockly Accesible es necesario conocer las siguientes instrucciones:
      <ol>
        <li>Utiliza Tab para navegar entre botones hacia adelante, y Shift + Tab para volver atrás.</li>
        <li>Para explorar el espacio de trabajo utiliza las flechas.</li>
        <li>Las instrucciones, la traducción a código y la ejecución del código aparecerán en una nueva ventana del navegador.</li>
        <li>Existen atajos de teclado para facilitar el uso del programa, por ejemplo: Control + Espacio para ejecutar el código.</li>
      </ol>
    </p>
    `;

manualBtn.onclick = function() {
  let winIntructions = window.open('', 'manual',
      'scrollbars=yes,resizable=yes,menubar=no,toolbar=no,width=600,height=600');
  winIntructions.document.write('<title>Manual nueva ventana</title>'
      + manual);
  winIntructions.document.close();
}
tutorialBtn.onclick = function() {
  let winIntructionsTutorial = window.open('', 'instructionsTutorial',
      'scrollbars=yes,resizable=yes,menubar=no,toolbar=no,width=600,height=600');
  winIntructionsTutorial.document.write('<title>Instrucciones nueva ventana</title>'
      + instructionsTutorial.innerHTML);
  winIntructionsTutorial.document.close();
}
home.onclick = function() {
  window.location.href = "../../../../../index.html";
}
selection.onclick = function() {
  window.location.href = "../seleccion_tutorial.html";
}
