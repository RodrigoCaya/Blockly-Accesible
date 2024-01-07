goog.require('blocklyApp.AudioService');

document.addEventListener('keydown', function(event) {
  // CTRL + Space
  if (event.ctrlKey && event.key == ' ') {
    const runCodeBtn = document.getElementById("runCodeBtn");
    if (runCodeBtn == null) {
      return;
    }
    runCodeBtn.click();
  }
  // CTRL + F1
  if (event.ctrlKey && event.key == 'F1') {
    const showPythonCodeBtn = document.getElementById("showPythonCodeBtn");
    if (showPythonCodeBtn == null) {
      return;
    }
    showPythonCodeBtn.click();
  }
  // CTRL + F2
  if (event.ctrlKey && event.key == 'F2') {
    const showJSCodeBtn = document.getElementById("showJSCodeBtn");
    if (showJSCodeBtn == null) {
      return;
    }
    showJSCodeBtn.click();
  }
  // CTRL + I
  if (event.ctrlKey && event.key == 'i') {
    const tutorialBtn = document.getElementById("tutorialBtn");
    if (tutorialBtn == null) {
      return;
    }
    tutorialBtn.click();
  }
  // Prevent TAB from moving focus out of the editor
  if (event.key == 'Tab') {
    let visibleInputs = Array.from(document.querySelectorAll('button')).filter(function(input) {
      return (input.offsetWidth > 0 || input.offsetHeight > 0) && !input.disabled;
    });
    if (visibleInputs.length === 1) {
      visibleInputs = Array.from(document.querySelectorAll('select, button')).filter(function(input) {
        return (input.offsetWidth > 0 || input.offsetHeight > 0) && !input.disabled;
      });
    }
    const first = visibleInputs[0];
    const last = visibleInputs[visibleInputs.length - 1];
    const audioService = new blocklyApp.AudioService();
    if (!event.shiftKey && event.target === last) {
        audioService.playMouseSound();
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && event.target === first) {
        audioService.playMouseSound();
        event.preventDefault();
        last.focus();
      }
  }
});