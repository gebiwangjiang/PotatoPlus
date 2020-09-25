function injectScript(path, module = false, defer = false) {
  var script = document.createElement('script');
  if (defer) script.setAttribute('defer', '');
  if (module) script.setAttribute('type', 'module');
  else script.setAttribute('type', 'text/javascript');
  script.src = chrome.extension.getURL(path);
  document.documentElement.appendChild(script);
}

function injectStyle(path) {
  var stylesheet = document.createElement('link');
  stylesheet.setAttribute('type', 'text/css');
  stylesheet.setAttribute('rel', 'stylesheet');
  stylesheet.setAttribute('href', chrome.extension.getURL(path));
  document.documentElement.appendChild(stylesheet);
}

function injectScriptFromString(str) {
  var script = document.createElement('script');
  script.text = str;
  document.documentElement.appendChild(script);
}

function injectStyleFromString(str) {
  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = str;
  document.documentElement.appendChild(style);
}

(function() {
  var modes_reg = {
    course: /grablessons.do/i, // 选课
  }
  window.pjw_mode = "";
  for (const mode_name in modes_reg) {
    if (modes_reg[mode_name].test(window.location.href) == true) {
      pjw_mode = mode_name;
      break;
    }
  }

  // injectStyle("css/material-components-web.min.css");
  // injectStyle("css/pjw-general.css");
  // injectStyle("css/pjw-classlist.css");
  // injectStyle("css/pjw-filter.css");

  injectScript("js/store.min.js");
  injectScript("js/material-components-web.min.js");

  injectScriptFromString(`
    var pjw_mode = "${pjw_mode}";
  `);

  if (pjw_mode != "") {
    injectScript("js/tinypinyin.js");
    injectScript("js/pjw-console.js");
    injectScript("js/pjw-lib.js");
    injectScript("js/pjw-filter-modern.js");
    injectScript("js/pjw-classlist-modern.js");
  }

  injectScript("js/pjw-supercore.js");
})();