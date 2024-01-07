/**
 * AccessibleBlockly
 *
 * Copyright 2016 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Angular2 Component that details how a Blockly.Workspace is
 * rendered in AccessibleBlockly.
 *
 * @author madeeha@google.com (Madeeha Ghori)
 */

goog.provide('blocklyApp.WorkspaceComponent');

goog.require('blocklyApp.NotificationsService');
goog.require('blocklyApp.ToolboxModalService');
goog.require('blocklyApp.TranslatePipe');
goog.require('blocklyApp.TreeService');

goog.require('blocklyApp.WorkspaceBlockComponent');

blocklyApp.WorkspaceComponent = ng.core.Component({
  selector: 'blockly-workspace',
  template: `
    <div class="blocklyWorkspaceColumn">
      <p style="font-weight: bold;" #workspaceTitle id="blockly-workspace-title">{{'WORKSPACE'|translate}}</p>
      <button (click)="runCode()" id="runCodeBtn">
        Ejecutar código (Control + Espacio)
      </button>
      <button (click)="showPythonCode()" id="showPythonCodeBtn" aria-label="Mostrar código Paiton (Control + F1)">
        Mostrar código Python (Control + F1)
      </button>
      <button (click)="showJSCode()" id="showJSCodeBtn" aria-label="Mostrar código YavaScript (Control + F2)">
        Mostrar código JavaScript (Control + F2)
      </button>
      <div *ngIf="workspace" class="blocklyWorkspace">
        <ol #tree *ngFor="#topBlock of workspace.topBlocks_; #groupIndex = index"
            [id]="tree.id || getNewTreeId()"
            tabindex="0" role="tree" class="blocklyTree blocklyWorkspaceFocusTarget"
            [attr.aria-activedescendant]="getActiveDescId(tree.id)"
            [attr.aria-labelledby]="workspaceTitle.id"
            (keydown)="onKeypress($event, tree)"
            (focus)="speakLocation(groupIndex, tree.id)">
          <blockly-workspace-block [level]="0" [block]="topBlock" [tree]="tree">
          </blockly-workspace-block>
        </ol>

        <span *ngIf="workspace.topBlocks_.length === 0">
          <p id="emptyWorkspaceBtnLabel">
            {{'NO_BLOCKS_IN_WORKSPACE'|translate}}
          </p>
          <p>
            <button (click)="showToolboxModalForCreateNewGroup()"
                    class="blocklyWorkspaceFocusTarget"
                    id="{{ID_FOR_EMPTY_WORKSPACE_BTN}}"
                    aria-describedby="emptyWorkspaceBtnLabel">
              {{'CREATE_NEW_BLOCK_GROUP'|translate}}
            </button>
          </p>
        </span>
      </div>
    </div>
  `,
  directives: [blocklyApp.WorkspaceBlockComponent],
  pipes: [blocklyApp.TranslatePipe]
})
.Class({
  constructor: [
    blocklyApp.NotificationsService,
    blocklyApp.ToolboxModalService,
    blocklyApp.TreeService,
    function(notificationsService, toolboxModalService, treeService) {
      this.notificationsService = notificationsService;
      this.toolboxModalService = toolboxModalService;
      this.treeService = treeService;

      this.ID_FOR_EMPTY_WORKSPACE_BTN = blocklyApp.ID_FOR_EMPTY_WORKSPACE_BTN;
      this.workspace = blocklyApp.workspace;
      this.currentTreeId = 0;
    }
  ],
  getNewTreeId: function() {
    this.currentTreeId++;
    return 'blockly-tree-' + this.currentTreeId;
  },
  getActiveDescId: function(treeId) {
    return this.treeService.getActiveDescId(treeId);
  },
  onKeypress: function(e, tree) {
    this.treeService.onKeypress(e, tree);
  },
  showToolboxModalForCreateNewGroup: function() {
    this.toolboxModalService.showToolboxModalForCreateNewGroup(
        this.ID_FOR_EMPTY_WORKSPACE_BTN);
  },
  speakLocation: function(groupIndex, treeId) {
    this.notificationsService.speak(
        'Estas en el espacio de trabajo ' + (groupIndex + 1) + ' de ' +
        this.workspace.topBlocks_.length);
  },
  runCode: function() {
    // Generate JavaScript code and run it.
    window.LoopTrap = 1000;
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
        'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    let code = Blockly.JavaScript.workspaceToCode(this.workspace);
    // console.log('code', code)
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    try {
      let alerts = code.match(/window.alert\(.+\);/g);
      if (!alerts) {
        alerts = [];
      }
      alerts = alerts.map(function(alert) {
        return alert.substring(alert.indexOf('(') + 1, alert.indexOf(');'));
      });
      // console.log('alerts', alerts);
      let newWindowText = [];
      let newWindow = code;
      let flagError;
      for (let i = 0; i < alerts.length; i++) {
        flagError = false;
        try {
          // console.log('alerts[i]', alerts[i])
          eval(alerts[i]);
        } catch (e) {
          flagError = true;
        }
        // console.log("flag", flagError)
        if (flagError) {
          newWindowText.push(`win.document.write('<xmp id="code">' + ` + alerts[i] + ` + '</xmp>');`);
        } else {
          newWindowText.push(`win.document.write('<xmp id="code">' + "` + eval(alerts[i]).toString() + `" + '</xmp>');`);
        }
        // console.log('newWindowText', newWindowText)
      }
      let win = window.open('', 'blocklyCode',
      'scrollbars=yes,resizable=yes,menubar=no,toolbar=no,width=600,height=600');
      win.document.write('<title>Resultado nueva ventana del navegador</title>'
      + 'Esta es una nueva ventana del navegador, si quieres cambiar de ventana puedes presionar Alt + Tab, y si quieres cerrar esta ventana puedes presionar Control + W.'
      + '<p style="font-size: 24px; font-weight: bold;">Resultado del código</p>');
      newWindowText.forEach(function(text) {
        newWindow = newWindow.replace(/window.alert\(.+\);/, text);
      });
      // console.log('newWindow', newWindow)
      eval(newWindow);
      win.document.close();
    } catch (e) {
      let winError = window.open('', 'blocklyCode',
      'scrollbars=yes,resizable=yes,menubar=no,toolbar=no,width=600,height=600');
      winError.document.write('<title>Error nueva ventana del navegador</title>'
      + 'Esta es una nueva ventana del navegador, si quieres cambiar de ventana puedes presionar Alt + Tab, y si quieres cerrar esta ventana puedes presionar Control + W.'
      + '<p style="font-size: 24px;">Error en el código</p>'
      + '<xmp id="code">' + e + '</xmp>');
      winError.document.close();
    }
  },
  showJSCode: function() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    let code = Blockly.JavaScript.workspaceToCode(this.workspace);
    let win = window.open('', 'javascriptCode',
    'scrollbars=yes,resizable=yes,menubar=no,toolbar=no,width=600,height=600');
    win.document.write('<title>Javascript nueva ventana del navegador</title>'
    + 'Esta es una nueva ventana del navegador, si quieres cambiar de ventana puedes presionar Alt + Tab, y si quieres cerrar esta ventana puedes presionar Control + W.'
    + '<p style="font-size: 24px;">Código en Javascript</p>'
    + '<xmp id="javascript">' + code + '</xmp>');
    win.document.close();
  },
  showPythonCode: function() {
    Blockly.Python.INFINITE_LOOP_TRAP = null;
    let code = Blockly.Python.workspaceToCode(this.workspace);
    let win = window.open('', 'pythonCode',
        'scrollbars=yes,resizable=yes,menubar=no,toolbar=no,width=600,height=600');
    win.document.write('<title>Python nueva ventana del navegador</title>'
    + 'Esta es una nueva ventana del navegador, si quieres cambiar de ventana puedes presionar Alt + Tab, y si quieres cerrar esta ventana puedes presionar Control + W.'
    + '<p style="font-size: 24px;">Código en Python</p>'
    + '<xmp id="python">' + code + '</xmp>');
    win.document.close();
  }
});
