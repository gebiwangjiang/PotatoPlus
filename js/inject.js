if (!window.browser) window.browser = window.chrome;

function injectScript(path, module = false, defer = false) {
  var script = document.createElement('script');
  if (defer) script.setAttribute('defer', '');
  if (module) script.setAttribute('type', 'module');
  else script.setAttribute('type', 'text/javascript');
  script.src = browser.extension.getURL(path);
  document.documentElement.appendChild(script);
}

function injectStyle(path) {
  var stylesheet = document.createElement('link');
  stylesheet.setAttribute('type', 'text/css');
  stylesheet.setAttribute('rel', 'stylesheet');
  stylesheet.setAttribute('href', browser.extension.getURL(path));
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
    course: /grablessons.do/i, // 选课系统列表
    xk_system: /\/\/xk.nju.edu.cn/i, // 选课系统 xk.nju.edu.cn 界面

    major_course: /student\/elective\/specialityCourseList.do/i, // 专业选课
    union: /student\/elective\/index.do/i, // 选课
    gym: /gymClassList.do/i, // 体育补选
    read: /readRenewCourseList.do/i, // 经典导读读书班补选
    dis: /discussRenewCourseList/i, // 导学、研讨、通识课补选
    public: /publicRenewCourseList/i, // 公选课补选
    open: /openRenewCourse/i, // 跨专业补选
    art: /artRenewCourseList/i, // 美育补选
    common: /commonCourseRenewList|commonRenew.do/i, // 通修课补选

    read_view: /elective\/readCourseList.do/i, // 经典导读读书班初选
    dis_view: /elective\/freshman_discuss.do/i, // 导学、研讨、通识课初选
    art_view: /elective\/artList.do/i, // 美育初选
    public_view: /elective\/publicCourseList.do/i, // 公选课初选
    open_view: /elective\/open.do/i, // 跨专业初选

    course_eval: /evalcourse\/courseEval.do\?method=currentEvalCourse/i, // 课程评估

    all_course_list: /teachinginfo\/allCourseList.do\?method=getTermAcademy/i, // 全校课程
    grade_info: /student\/studentinfo\/achievementinfo.do\?method=searchTermList/i, // 成绩查看
    course_info: /courseList.do\?method=getCourseInfoM/i, // 课程详细信息

    main_page: /(\/jiaowu\/student\/index.do|\/jiaowu\/login.do)/i, // 主页
    login_page: /(\/jiaowu\/exit.do|\/jiaowu$|\/jiaowu\/$|\/jiaowu\/index.jsp)/i // 登录页
  }
  window.pjw_mode = "";
  for (const mode_name in modes_reg) {
    if (modes_reg[mode_name].test(window.location.href) == true) {
      pjw_mode = mode_name;
      break;
    }
  }

  /* BELOW COMMENTS ARE USED TO GENERATE USERSCRIPT */
  // injectStyle("css/material-components-web.min.css");
  // injectStyle("css/pjw.css");
  // injectStyle("css/pjw-classlist.css");
  // injectStyle("css/pjw-filter.css");
  // injectStyle("css/pjw-console.css");
  /* DO NOT REMOVE */

  /* Let's backup the builtin JS prototype so that the FAAAAACING prototype.js won't FAACING RUIN MY CODE AND MY LIFE IN THIS PROJECT */
  injectScriptFromString(`window.proto_backup = {
    reduce: Array.prototype.reduce
  };`);

  if (window.pjw_mode != "course" && window.pjw_mode != "xk_system") {
    injectScript("js/jquery.min.js");
  }
  injectScript("js/store.min.js");
  injectScript("js/material-components-web.min.js");

  injectScriptFromString(`
    var pjw_mode = "${pjw_mode}";
  `);
  if (pjw_mode == "grade_info") {
    injectStyleFromString(`table.TABLE_BODY{ display: none; }`);
  } else if (pjw_mode == "main_page") {
    injectScriptFromString(`alert = function(x) {window.alert_data = x;};`);
  }

  if (pjw_mode != "") {
    injectScript("js/tinypinyin.js");
    injectScript("js/pjw-console.js");
    injectScript("js/pjw-lib.js");
    injectScript("js/pjw-filter.js");
    injectScript("js/pjw-classlist.js");
    injectScript("js/pjw-modes.js");
  }
  if (pjw_mode == "login_page") {
    injectScript("js/pjw-captcha.js");
  }

  injectScript("js/pjw-core.js");
})();