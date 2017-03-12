/**
 * Created by Tomson on 14-8-20.
 */
$(function () {

  $.widget("edj.optionBox", {
//var widget = {
//插件配置
    options: {
      optionBoxIsShow: false,
      searchBox: true,
      orderByLetter: true,
      orderByLetterLowercase: false,
      orderLetterSize:5,
      orderLetters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      optionData: [],
      mouseOver: true,
      mouseOverDuration: 500,
      searchKeyUpDuration: 500,
      itemSelectedCallback: undefined,
      openBoxType: "mouseover",
      hotWords: []
    },
    _firstLetters: "BPMFDTLGKJQXZCSW",
    _specialLetters: "AOEHN",
//    按键延迟监听器
    _timeoutListener: undefined,
    _mouseHoverTimer: undefined,
    //原始数据
    _dataSource: {},
    //匹配结果
    _result: [],
    //初始化插件
    _setOptions: function () {
      this._superApply(arguments);
    },
    _setOption: function (key, value) {
      // prevent invalid color values
//      if ( /red|green|blue/.test(key) && (value < 0 || value > 255) ) {
//        return;
//      }
      this._super(key, value);
    },
    _create: function () {
//      this

      var selectedItem = this.options.optionData.length > 0 ? this.options.optionData[0].name : "北京";
      this._dataSource = this.options.optionData;
      this.element
          .addClass("edj-option-box-open-btn")
          .text(selectedItem);
      this._createGrid();
      this._tabConstructor();
    },
    //标签构造引擎
    _tabConstructor: function () {
      var htmlTags = '';
      htmlTags += '<div class="edj-option-box-container" style="display: none;">';
      if (this.options.searchBox) {
        htmlTags += '<div class="edj-search-box"><label for="edj-search-input" style="*display: none;">搜索城市</label><input id="edj-search-input" type="search" style="*display: none;"/>';
        //热词逻辑
        var hotWords = this.options.hotWords;
        if (hotWords.length > 0) {
          htmlTags += '<div class="edj-hot-word"><span>热门:</span><ul class="hot-word-list">';

          for (var i = 0; i < hotWords.length; i++) {
            htmlTags += '<li><a class="edj-item-btn" ';

            for (_item in hotWords[i]) {
              htmlTags += 'data-' + _item + '="' + hotWords[i][_item] + '" '
            }

            htmlTags += '>' + hotWords[i].name + '</a></li>';
          }
          htmlTags += '</ul></div>';
        }

        htmlTags += '<button type="button" class="close" style="margin: 10px 15px;">&times;</button></div>';

      }
//  字母排序tab
      htmlTags += '<div class="edj-letter-tabs">';
      var tagLetters = "";
      for (index in this._dataSource) {
        if (this._isEmptyValue(this._dataSource[index])) {
          continue;
        }
        tagLetters = tagLetters + index.toString();
      }
      tagLetters = tagLetters.split("").sort().join("");
      var a = tagLetters.length, b = this.options.orderLetterSize;
      var c = a % b > 0 ? (a - (a % b)) / b + 1 : a / b;
      var arrTagTittle = [];
      for (var i = 0; i < c; i++) {
        htmlTags += '<a class="edj-letter-tab-item" href="#" data-content-id="' + tagLetters.substr(i * b, b) + '" ><span>' + tagLetters.substr(i * b, b) + '</span></a>';
        arrTagTittle.push(tagLetters.substr(i * b, b));
      }
      htmlTags += '</div><div class="edj-content-container">';
//    htmlTags+='<div class="edj-tag-item">';
      for (var i = 0; i < arrTagTittle.length; i++) {
        var l = arrTagTittle[i].length;
        htmlTags += '<div class="edj-tag-container"  data-content-id="' + tagLetters.substr(i * b, b) + '" style="display: none">';
        for (var j = 0; j < l; j++) {
          var letter = arrTagTittle[i].substr(j, 1)
          htmlTags += '<dl class="edj-letter-row"><dt>' + letter + '</dt><dd><ul>';

          var items = this._dataSource[letter];
          for (var k = 0; k < items.length; k++) {
            htmlTags += '<li><a class="edj-item-btn" ';

            for (_item in items[k]) {
              htmlTags += 'data-' + _item + '="' + items[k][_item] + '" '
            }

            htmlTags += '>' + items[k].name + '</a></li>';
          }
          htmlTags += '</ul></dd></dl>'
        }
        htmlTags += '</div>';
      }
      htmlTags += '</div>';
//    搜索结果
      htmlTags += '<div class="edj-search-result-container" style="display: none;"></div>';
      this.element.after(htmlTags);
      $("a.edj-letter-tab-item").eq(0).addClass("edj-letter-tab-active");
      $("div[data-content-id='" + $("a.edj-letter-tab-item").eq(0).data("content-id") + "']").show();
      this._addSearchEvent();
      this._addTagEvent();
      this._addItemClickEvent();
      this._addOpenBoxEvent();
    },
//    点击事件
    _addItemClickEvent: function () {
      var that = this;
      $(".edj-item-btn,.close").off("click").on("click", function () {

        that.element.text($(this).data("name"));
        $(".edj-option-box-container").hide();
      });
      if (typeof this.options.itemSelectedCallback === "function") {
        this._addSelectedCallback();
      }

    },
//    选项列表展开点击事件
    _clickEvent: function (e) {
      $(this).next().toggle();
      e.preventDefault();
    },
//    选项列表展开悬浮事件
    _mouseOverEvent: function (e, t) {

      t._mouseHoverTimer = setTimeout(function () {
        t.element.next().show();
      }, t.options.mouseOverDuration);
      t.element.on("mouseout", function () {
        clearTimeout(t._mouseHoverTimer)

      });
      $("body").on("click", function (e) {
        if (!$(e.target).hasClass("edj-option-box-open-btn")) {
          if ($(e.target).parents("[class^='edj-']").length == 0)
            t.element.next().hide();
        }
      });


    },
//    添加选项列表展开事件
    _addOpenBoxEvent: function () {
      var t = this;
      switch (this.options.openBoxType) {
        case "click":
          $("a.edj-option-box-open-btn").live("click", this._clickEvent);
          break;
        case "mouseover" :
        default:
          $("a.edj-option-box-open-btn").on("mouseover", function (e) {
            t._mouseOverEvent(e, t)
          });
          break;
      }
    },
//    添加选项点击事件回调
    _addSelectedCallback: function () {
      var that = this;

      $(".edj-item-btn").on("click", function (e) {

        that.options.itemSelectedCallback(e, $(this));
      });


    },
//    添加选项卡点击事件
    _addTagEvent: function (index) {
      $("a.edj-letter-tab-item").on("click", function (e) {
        var contentId = $(this).data("content-id");
        $("a.edj-letter-tab-item").removeClass("edj-letter-tab-active");
        $(this).addClass("edj-letter-tab-active");
//        var queryStr= this._isEmptyValue(index)?"div[data-content-id]":"div[data-content-id='"+index+"']";
        $("div[data-content-id]").hide();
        $("div[data-content-id='" + contentId + "']").show();
        e.preventDefault();
      });
    },
//    添加搜索事件
    _addSearchEvent: function (callback) {
      var that = this;
      $("div.edj-search-box").find("input#edj-search-input").on('keyup', function () {
        var searchStr = $(this).val();
        if (that._isEmptyValue(searchStr)) {
          that._hideSearchResult();
        } else {
          that._checkKeyUpTimeout(searchStr);
        }
      });
    },
//    检查按键延迟
    _checkKeyUpTimeout: function (searchStr) {
      var that = this;
      if (that._timeoutListener != undefined) {
        clearTimeout(that._timeoutListener);
        that._timeoutListener = undefined;
      }
      that._timeoutListener = setTimeout(function () {
        that._DataFilter(searchStr);
        that._showSearchResult();
      }, that.options.searchKeyUpDuration);
    },
//    关闭查询结果
    _hideSearchResult: function () {
      $(".edj-search-result-container").hide();
    },
//    现实查询结果
    _showSearchResult: function () {
      if (this._isEmptyValue(this._result)) {
        var htmlTags = '<h3>对不起，没有查询到结果。</h3>'
        $("div.edj-search-result-container").html("").append(htmlTags).show();
        return false;
      }
      var htmlTags = '<ul class="edj-search-result-list">';
      for (var i = 0; i < this._result.length; i++) {
        htmlTags += '<li><a class="edj-item-btn" ';
        for (_item in this._result[i]) {
          htmlTags += 'data-' + _item + '="' + this._result[i][_item] + '" '
        }
        htmlTags += '>' + this._result[i].name + '</a></li>';
      }
      htmlTags += '</ul>'
      $("div.edj-search-result-container").html("").append(htmlTags).show();
      this._addItemClickEvent();
    },
    //判断输入是否是首字母
    _isFirstLetter: function (letter) {
      if (this._isEmptyValue(letter)) {
        return false;
      }
      return !!(this._firstLetters.indexOf(this._capsCase(letter).toUpperCase()) + 1);
    },
    //判断是否是特殊韵母
    _isSpecialLetter: function (letter) {
      if (this._isEmptyValue(letter)) {
        return false;
      }
      return !!(this._specialLetters.indexOf(this._capsCase(letter).toUpperCase()) + 1);
    },
    //大小写转换
    _capsCase: function (e) {
      if (this.options.orderByLetterLowercase) {
        return e.toLowerCase();
      } else {
        return e.toUpperCase();
      }
    },
    //键盘按键升起时间
    _keyUpEvent: function (e) {
      var $target = e instanceof jQuery ? e : this._isEmptyValue(e) ? undefined : $(e);
      var searchLetters = $target.value().split("");
      for (var i = 0; i < searchLetters.length; i++) {

      }

    },
//    数据过滤
    _DataFilter: function (strSearch) {
      this._result = [];
      strSearch.replace(new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？][0-9]"), "");
      var re = /[a-z]|[A-Z]/;
      if ((re.test(strSearch))) {

        strSearch = strSearch.toUpperCase();
        for (var i = 0; i < strSearch.length; i++) {
          var currentLetter = strSearch.substr(i, 1);
          //首字母逻辑
          if (i == 0) {
            if (this._isEmptyValue(this._dataSource[currentLetter])) {
              return null;
            }
            else {
              for (var j = 0; j < this._dataSource[currentLetter].length; j++) {
                //将拼音首字母相同的数据放入_result中
                this._result.push(this._dataSource[currentLetter][j]);
              }
            }
          }
          //非首字母逻辑
          else {
            //输入的非首字母如果是声母查找过滤_result中数据的对应位置汉字拼音首字母
            if (this._isFirstLetter(currentLetter)) {
              for (var j = 0; j < this._result.length; j++) {
                var currentData = this._result[j];
                if (!!currentData.pinyin.split(",")[i]) {
                  if (currentLetter != currentData.pinyin.split(",")[i].substr(0, 1).toUpperCase()) {
                    this._result.splice(j, 1);
                    j = !!j ? j - 1 : 0;
                  }
                }
                else if (strSearch.substr(0, i + 1).toUpperCase() == currentData.pinyin.replace(",", "").substr(0, i + 1).toUpperCase()) {
                  isFound = true;
                }
              }
            }
            //        输入的非首字母如果不是汉字拼音声母
            else {
              for (var j = 0; j < this._result.length; j++) {
                var currentData = this._result[j];
                var isFound = false;
                //   _result中数据的拼写匹配
                if (strSearch.substr(0, i + 1).toUpperCase() == currentData.pinyin.replace(",", "").substr(0, i + 1).toUpperCase()) {
                  isFound = true;
                } else if (this._isSpecialLetter(currentLetter)) {
                  //_result中数据的对应位置汉字拼音首字母匹配
                  if (currentData.pinyin.split(",").length > i) {

                    if (currentLetter == currentData.pinyin.split(",")[i].substr(0, 1).toUpperCase()) {
                      isFound = true;
                    }
                  }
                }

                if (!isFound) {
                  this._result.splice(j, 1);
                  j = !!j ? j - 1 : 0;
                }
              }
            }
          }
        }
      }
      else {
        this._result = [];
        if (strSearch != "") {
          for (index in this._dataSource) {
            if (this._isEmptyValue(this._dataSource[index])) {
              continue;
            }
            for (var i = 0; i < this._dataSource[index].length; i++) {
              if (this._dataSource[index][i].name.indexOf(strSearch) > -1) {
                this._result.push(this._dataSource[index][i]);
              }
            }
          }
        }

      }

//      console.log(this._result);
    },

//    组内排序
    _secondLetterSort: function (arr) {
      arr.sort(function (a, b) {
          var a_value = ('' + a.pinyin).substr(0, 1).toLowerCase(),
              b_value = ('' + b.pinyin).substr(0, 1).toLowerCase();
          if(a_value > b_value) return 1;
          if(a_value < b_value) return -1;
          return 0;
      });
      return arr;
    },

//分组
    _createGrid: function () {
      var resArray = [];
      var letters = this.options.orderLetters;
      for (var i = 0; i < letters.length; i++) {
        resArray[letters.substr(i, 1)] = [];
      }
      var arrData = this._dataSource;
      for (var i = 0; i < arrData.length; i++) {
        resArray[arrData[i].pinyin.substr(0, 1).toUpperCase()].push(arrData[i]);
      }
      for (var key in resArray) {
        if (this._isEmptyValue(resArray[key])) {
          continue;
        }
        resArray[key] = this._secondLetterSort(resArray[key]);
      }
      this._dataSource = resArray;
    },
//    判断空值
    _isEmptyValue: function (value) {
      var type;
      if (value == null) { // 等同于 value === undefined || value === null
        return true;
      }
      type = Object.prototype.toString.call(value).slice(8, -1);
      switch (type) {
        case 'String':
          return !$.trim(value);
        case 'Array':
          return !value.length;
        case 'Object':
          return $.isEmptyObject(value); // 普通对象使用 for...in 判断，有 key 即为 false
        default:
          return false; // 其他对象均视作非空
      }
    }
  });



  var hotCities = [];


    var mPriceList = {
        method:"open.site.cityPrice",
        params: {identify:"all",show_type:"new"}
    },dataList=[];

    var priceDataCache = {};

    var priceTemplateRender;
    var priceViewRender = function(feeId, day, cityName) {
      var priceData = priceDataCache.fee_list;
      var daytime = priceDataCache.daytime_price;

      //价格体系调整，新增保险费和远途费从接口读取
      function render() {
        var mExtraFee = {
          method: "c.city.pricelist",
          params: {
            cityName: cityName
          }
        };
        Common.getRequest(mExtraFee).then(function(json) {
          if (json.code) {
            return;
          }
          var str={};
          str.extra = json.price_list.extra;
          str.priceList=priceData[feeId];
          str.photo=feeId;
          $(".price-sheet-and-chart2").html(priceTemplateRender(str));
          $('#priceBarChart').edjPriceBarChart(priceData[feeId].part_price);
        });
      }
      if(priceTemplateRender) {
        render();
      } else {
        $.when(Common.getTemplate("templates/price2.temp")).then(function (m) {
          if (m == "") {
              return false;
          }
          priceTemplateRender = doT.template(m);
          render();
        });
      }
    }

    Common.getRequest(mPriceList).then(function (obj) {
        if(obj.code==1){
            for (k in obj.data.city_list){
                dataList.push(obj.data.city_list[k]);
            }

            priceDataCache = obj.data;

            $("a.city-list").optionBox({optionData: dataList, hotWords: hotCities, openBoxType: "mouseover", itemSelectedCallback: function (e, t) {
                var priceId = $(t).data("fee_id");
                var day=$(t).data("daytime_price");
                priceViewRender(priceId, day, $(t).data('name'));
            }});
            priceViewRender(dataList[0].fee_id, dataList[0].daytime_price, dataList[0].name);
        }

    });
});
