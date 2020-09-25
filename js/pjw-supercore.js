window.potatojw_intl = function() {
  if (typeof(window.pjw_version) == "string") return;

  window.pjw_platform = "@platform@";
  if (window.pjw_platform[0] == "@")
    window.pjw_platform = "General Plugin";

  window.pjw_version = "@version@";
  if (window.pjw_version[0] == "@")
    window.pjw_version = "0.3";

  var head_metadata = `
    <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
    <link rel="shortcut icon" href="https://www.nju.edu.cn/_upload/tpl/01/36/310/template310/images/16.ico" type="image/x-icon">
  `;
  $("head").prepend(head_metadata);

  // UI Improvement

  var reset_storage_confirm = false;
  window.resetStorage = function() {
    if (reset_storage_confirm) {
      store.clearAll();
      reset_storage_confirm = false;
      $("#reset_storage").html("重置存储");
    } else {
      $("#reset_storage").html("确定重置？");
      reset_storage_confirm = true;
    }
  }
  if ($("cv-clearfix").length > 0)
    $("cv-clearfix").prepend(`<span class="pjw-mini-button" style="color: gray;" onclick="resetStorage();" id="reset_storage">重置存储</span>
      <span class="pjw-mini-button" onclick="window.open('https://cubiccm.ddns.net/potatoplus')">v${pjw_version}</span>`);

  console.log("PotatoPlus v" + pjw_version + " by Limosity");

  if (pjw_mode == "") return;

  console.log(pjw_mode + " mode activated");

  if (store.get("login_settings") != null && store.get("login_settings").share_stats == true) {
    $("head").append($(google_analytics_js));
  }

  // Storage Upgrade  
  if (store.get("version") == null || store.get("version") != pjw_version) {
    store.set("version", pjw_version);
  }




  if (pjw_mode == "course") {
    window.getListParam = function(page) {
      function getOrderString() {
        var order = '';
        var $orderDomArr = $('.result-container .course-order[data-order="order"]');
        if ($orderDomArr.length == 0) {
          $orderDomArr = $('.result-container .course-order[data-order="desc"]');
        }
        if ($orderDomArr.length > 0) {
          var orderField = $orderDomArr.eq(0).attr('data-type');
          switch (orderField) {
            case 'KCH':
              order += 'courseNumber';
              break;
            case 'KCMC':
              order += 'courseName';
              break;
            case 'XF':
              order += 'credit';
              break;
            case 'JSMC':
              order += 'teacherName';
              break;
            case 'SJDD':
              order += 'teachingPlace';
              break;
            case 'YXRS':
              order += 'classCapacity';
              break;
            case 'XQ':
              order += 'campusName';
              break;
            case 'XKFS':
              order += 'typeName';
              break;
            case 'BJS':
              order += 'number';
              break;
            case 'BZ':
              order += 'extInfo';
              break;
            case 'KCXZ':
              order += 'courseNatureName';
              break;
            case 'KCLB':
              order += 'courseSection';
              break;
            case 'KKDW':
              order += 'departmentName';
              break;
            case 'TXSJ':
              order += 'deleteOperateTime';
              break;
            case 'NJ':
              order += 'recommendGrade';
              break;
            default:
              break;
          }
          if ($orderDomArr.eq(0).attr('data-order') == 'desc') {
            order += ' -';
          } else {
            order += ' +';
          }
        }
        return order;
      }
      var content = $('.search-input').val();
      content = content == null ? '' : content;
      if (content) {
        content = content.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"');
      }
      var studentInfo = JSON.parse(sessionStorage.getItem('studentInfo')); //学生信息
      var studentCode = studentInfo.code; // 学号
      // 选课批次
      var electiveBatch = studentInfo.electiveBatch;
      var electiveBatchCode = electiveBatch.code;
      // 当前校区
      var currentCampus = JSON.parse(sessionStorage.getItem('currentCampus'));
      var campus = currentCampus.code; // 校区
      var teachingClassType = sessionStorage.getItem("teachingClassTypeSecond"); // 教学班类型
      if (!teachingClassType) {
        teachingClassType = sessionStorage.getItem("teachingClassType"); // 教学班类型
      }
      var queryData = '{"studentCode":"' + studentCode + '","electiveBatchCode":"' + electiveBatchCode + '","teachingClassType":"' + teachingClassType + '"';
      if (campus) {
        queryData += ',"campus":"' + campus + '"';
      }
      var type = null;
      var value = null;
      $.each($('.search-container .search-item .search-value'), function(index, dom) {
        //平铺按钮类型
        type = $(dom).attr('data-search');
        if ($(dom).hasClass('cv-active')) {
          value = '0';
        } else {
          value = '2';
        }
        switch (type) {
          case 'SFCT':
            queryData += ',"checkConflict":"' + value + '"';
            break;
          case 'SFYM':
            queryData += ',"checkCapacity":"' + value + '"';
            break;
          default:
            break;
        }
      });
      $.each($('.search-container .search-item .cv-search-dropdown'), function(index, dom) {
        //下拉按钮类型
        type = $(dom).attr('data-search');
        value = $(dom).attr('data-code');
        if (value) {
          switch (type) {
            case 'KCXZ':
              content = 'KCXZ:' + value + ',' + content;
              break;
            case 'KCLB':
              content = 'YDKCLB:' + value + ',' + content;
              break;
            case 'NJ':
              content = 'FXNJ:' + value + ',' + content;
              break;
            case 'YX':
              content = 'FXYX:' + value + ',' + content;
              break;
            case 'ZY':
              content = 'FXZY:' + value + ',' + content;
              break;
            case 'SKNJ':
              content = 'ZXNJ:' + value + ',' + content;
              break;
            case 'SKYX':
              content = 'ZXYX:' + value + ',' + content;
              break;
            case 'SKZY':
              content = 'ZXZY:' + value + ',' + content;
              break;
            case 'XGXKLB':
              content = 'XGXKLBDM:' + value + ',' + content;
              break;
            case 'XKLX':
              content = 'CXCKLX:' + value + ',' + content;
              break;
            case 'KKDW':
              content = 'KKDWDM:' + value + ',' + content;
              break;
            case 'SKXQ':
              content = 'SKXQ:' + value + ',' + content;
              break;
            case 'KSJC':
              content = 'KSJC:' + value + ',' + content;
              break;
            case 'JSJC':
              content = 'JSJC:' + value + ',' + content;
              break;
            default:
              break;
          }
        }
      });
      queryData += ',"queryContent":"' + content + '"';
      queryData += '}';
      if (CVParams.pageNumber == null || CVParams.pageNumber < 0) {
        CVParams.pageNumber = 0;
      }
      var order = getOrderString();
      if (teachingClassType != 'QB') {
        if (order) {
          order = 'isChoose -,' + order;
        } else {
          order = 'isChoose -';
        }
      }
      var queryStr = '{"data":' + queryData + ',"pageSize":"' + CVParams.pageSize * 10 + '","pageNumber":"' + (page || CVParams.pageNumber) + '","order":"' + order + '"}';
      var queryParam = {
        'querySetting': queryStr
      };
      return queryParam;
    }

    window.queryPublicCourse = function(queryParam) {
      list.refresh();
      return BH_UTILS.doAjax(
          BaseUrl + "/sys/xsxkapp/elective/publicCourse.do",
          queryParam == null ? {} : queryParam,
          "post", {}, {
              "token": sessionStorage.token,
              language: sessionStorage.getItem('language')
          }
      );
    }

    ClassListPlugin();
    window.list = new PJWClassList($(".content-container"));
    $(".search-container").css("display", "none");
    $(".result-container").css("display", "none");

    list.parse = function(data) {

      return new Promise((resolve, reject) => {
        try {
          for (var item of data.dataList) {
            var select_status = item.isChoose == "1" ? "Selected" : (item.isFull == "1" ? "Full" : "Select");
            var class_data = {
              classID: item.teachingClassID,
              title: item.courseName,
              teachers: this.parseTeacherNames(item.teacherName),
              info: [{
                key: "课程编号",
                val: item.courseNumber
              }, {
                key: "备注",
                val: item.extInfo,
                hidden: true
              }, {
                key: "开课院系",
                val: item.departmentName,
                hidden: true
              }, {
                key: "年级",
                val: item.recommendGrade,
                hidden: true
              }],
              num_info: [{
                num: parseInt(item.credit),
                label: "学分"
              }, {
                num: parseInt(item.hours),
                label: "学时"
              }],
              lesson_time: this.parseLessonTime(item.teachingTimeList),
              time_detail: (item.teachingPlace || "").replace(/;/g, "<br>"),
              class_weeknum: this.parseWeekNum(item.teachingTimeList),
              select_button: {
                status: select_status,
                text: `${item.numberOfSelected}/${item.classCapacity}`,
                action: (e) => {
                  return new Promise((resolve, reject) => {
                    resolve();
                  });
                }
              },
              comment_button: {
                status: true,
                // text: (Math.random() * 10).toFixed(1)
              }
            };
            this.add(class_data);
          }
          this.update(data.totalCount);
        } catch (e) {
          reject(e);
        }
      });
    }

    list.load = function() {
      return new Promise((resolve, reject) => {
        $.ajax({
          type: "POST",
          url: BaseUrl + "/sys/xsxkapp/elective/publicCourse.do",
          data: getListParam(),
          headers: {
            "token": sessionStorage.token
          }
        }).done((data) => {
          var target = this;
          this.parse(data);
          resolve();
        }).fail((data) => {
          reject("无法获取数据：" + data);
        });
      });
    }

    list.refresh();
  }

};

var google_analytics_js = `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-173014211-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-173014211-1', {
    'custom_map': {'dimension1': 'version'}
  });
  gtag('event', 'version_dimension', {'version': pjw_version + " " + pjw_platform});
</script>
`;

(function() {
  if (document.readyState == "complete")
    potatojw_intl();
  else
    window.addEventListener("load", potatojw_intl);
})();