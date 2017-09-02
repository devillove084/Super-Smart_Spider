/*!

 @Title: Layui
 @Descriptionï¼šç»å…¸æ¨¡å—åŒ–å‰ç«¯æ¡†æž¶
 @Site: www.layui.com
 @Author: è´¤å¿ƒ
 @Licenseï¼šMIT

 */

;!function(win){
  "use strict";

  var doc = document, config = {
    modules: {} //è®°å½•æ¨¡å—ç‰©ç†è·¯å¾„
    ,status: {} //è®°å½•æ¨¡å—åŠ è½½çŠ¶æ€
    ,timeout: 10 //ç¬¦åˆè§„èŒƒçš„æ¨¡å—è¯·æ±‚æœ€é•¿ç­‰å¾…ç§’æ•°
    ,event: {} //è®°å½•æ¨¡å—è‡ªå®šä¹‰äº‹ä»¶
  }

  ,Layui = function(){
    this.v = '2.1.1'; //ç‰ˆæœ¬å·
  }

  //èŽ·å–layuiæ‰€åœ¨ç›®å½•
  ,getPath = function(){
    var js = doc.scripts
    ,jsPath = js[js.length - 1].src;
    return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
  }()

  //å¼‚å¸¸æç¤º
  ,error = function(msg){
    win.console && console.error && console.error('Layui hint: ' + msg);
  }

  ,isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]'

  //å†…ç½®æ¨¡å—
  ,modules = {
    layer: 'modules/layer' //å¼¹å±‚
    ,laydate: 'modules/laydate' //æ—¥æœŸ
    ,laypage: 'modules/laypage' //åˆ†é¡µ
    ,laytpl: 'modules/laytpl' //æ¨¡æ¿å¼•æ“Ž
    ,layim: 'modules/layim' //webé€šè®¯
    ,layedit: 'modules/layedit' //å¯Œæ–‡æœ¬ç¼–è¾‘å™¨
    ,form: 'modules/form' //è¡¨å•é›†
    ,upload: 'modules/upload' //ä¸Šä¼
    ,tree: 'modules/tree' //æ ‘ç»“æž„
    ,table: 'modules/table' //è¡¨æ ¼
    ,element: 'modules/element' //å¸¸ç”¨å…ƒç´ æ“ä½œ
    ,util: 'modules/util' //å·¥å…·å—
    ,flow: 'modules/flow' //æµåŠ è½½
    ,carousel: 'modules/carousel' //è½®æ’­
    ,code: 'modules/code' //ä»£ç ä¿®é¥°å™¨
    ,jquery: 'modules/jquery' //DOMåº“ï¼ˆç¬¬ä¸‰æ–¹ï¼‰

    ,mobile: 'modules/mobile' //ç§»åŠ¨å¤§æ¨¡å— | è‹¥å½“å‰ä¸ºå¼€å‘ç›®å½•ï¼Œåˆ™ä¸ºç§»åŠ¨æ¨¡å—å…¥å£ï¼Œå¦åˆ™ä¸ºç§»åŠ¨æ¨¡å—é›†åˆ
    ,'layui.all': '../layui.all' //PCæ¨¡å—åˆå¹¶ç‰ˆ
  };

  //è®°å½•åŸºç¡€æ•°æ®
  Layui.prototype.cache = config;

  //å®šä¹‰æ¨¡å—
  Layui.prototype.define = function(deps, callback){
    var that = this
    ,type = typeof deps === 'function'
    ,mods = function(){
      typeof callback === 'function' && callback(function(app, exports){
        layui[app] = exports;
        config.status[app] = true;
      });
      return this;
    };

    type && (
      callback = deps,
      deps = []
    );

    if(layui['layui.all'] || (!layui['layui.all'] && layui['layui.mobile'])){
      return mods.call(that);
    }

    that.use(deps, mods);
    return that;
  };

  //ä½¿ç”¨ç‰¹å®šæ¨¡å—
  Layui.prototype.use = function(apps, callback, exports){
    var that = this
    ,dir = config.dir = config.dir ? config.dir : getPath
    ,head = doc.getElementsByTagName('head')[0];

    apps = typeof apps === 'string' ? [apps] : apps;

    //å¦‚æžœé¡µé¢å·²ç»å­˜åœ¨jQuery1.7+åº“ä¸”æ‰€å®šä¹‰çš„æ¨¡å—ä¾èµ–jQueryï¼Œåˆ™ä¸åŠ è½½å†…éƒ¨jqueryæ¨¡å—
    if(window.jQuery && jQuery.fn.on){
      that.each(apps, function(index, item){
        if(item === 'jquery'){
          apps.splice(index, 1);
        }
      });
      layui.jquery = layui.$ = jQuery;
    }

    var item = apps[0]
    ,timeout = 0;
    exports = exports || [];

    //é™æ€èµ„æºhost
    config.host = config.host || (dir.match(/\/\/([\s\S]+?)\//)||['//'+ location.host +'/'])[0];

    //åŠ è½½å®Œæ¯•
    function onScriptLoad(e, url){
      var readyRegExp = navigator.platform === 'PLaySTATION 3' ? /^complete$/ : /^(complete|loaded)$/
      if (e.type === 'load' || (readyRegExp.test((e.currentTarget || e.srcElement).readyState))) {
        config.modules[item] = url;
        head.removeChild(node);
        (function poll() {
          if(++timeout > config.timeout * 1000 / 4){
            return error(item + ' is not a valid module');
          };
          config.status[item] ? onCallback() : setTimeout(poll, 4);
        }());
      }
    }

    //å›žè°ƒ
    function onCallback(){
      exports.push(layui[item]);
      apps.length > 1 ?
        that.use(apps.slice(1), callback, exports)
      : ( typeof callback === 'function' && callback.apply(layui, exports) );
    }

    //å¦‚æžœä½¿ç”¨äº† layui.all.js
    if(apps.length === 0
    || (layui['layui.all'] && modules[item])
    || (!layui['layui.all'] && layui['layui.mobile'] && modules[item])
    ){
      return onCallback(), that;
    }

    //é¦–æ¬¡åŠ è½½æ¨¡å—
    if(!config.modules[item]){
      var node = doc.createElement('script')
      ,url =  (
        modules[item] ? (dir + 'lay/') : (config.base || '')
      ) + (that.modules[item] || item) + '.js';

      node.async = true;
      node.charset = 'utf-8';
      node.src = url + function(){
        var version = config.version === true
        ? (config.v || (new Date()).getTime())
        : (config.version||'');
        return version ? ('?v=' + version) : '';
      }();

      head.appendChild(node);

      if(node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) && !isOpera){
        node.attachEvent('onreadystatechange', function(e){
          onScriptLoad(e, url);
        });
      } else {
        node.addEventListener('load', function(e){
          onScriptLoad(e, url);
        }, false);
      }

      config.modules[item] = url;
    } else { //ç¼“å­˜
      (function poll() {
        if(++timeout > config.timeout * 1000 / 4){
          return error(item + ' is not a valid module');
        };
        (typeof config.modules[item] === 'string' && config.status[item])
        ? onCallback()
        : setTimeout(poll, 4);
      }());
    }

    return that;
  };

  //èŽ·å–èŠ‚ç‚¹çš„styleå±žæ€§å€¼
  Layui.prototype.getStyle = function(node, name){
    var style = node.currentStyle ? node.currentStyle : win.getComputedStyle(node, null);
    return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
  };

  //csså¤–éƒ¨åŠ è½½å™¨
  Layui.prototype.link = function(href, fn, cssname){
    var that = this
    ,link = doc.createElement('link')
    ,head = doc.getElementsByTagName('head')[0];

    if(typeof fn === 'string') cssname = fn;

    var app = (cssname || href).replace(/\.|\//g, '')
    ,id = link.id = 'layuicss-'+app
    ,timeout = 0;

    link.rel = 'stylesheet';
    link.href = href + (config.debug ? '?v='+new Date().getTime() : '');
    link.media = 'all';

    if(!doc.getElementById(id)){
      head.appendChild(link);
    }

    if(typeof fn !== 'function') return that;

    //è½®è¯¢cssæ˜¯å¦åŠ è½½å®Œæ¯•
    (function poll() {
      if(++timeout > config.timeout * 1000 / 100){
        return error(href + ' timeout');
      };
      parseInt(that.getStyle(doc.getElementById(id), 'width')) === 1989 ? function(){
        fn();
      }() : setTimeout(poll, 100);
    }());

    return that;
  };

  //csså†…éƒ¨åŠ è½½å™¨
  Layui.prototype.addcss = function(firename, fn, cssname){
    return layui.link(config.dir + 'css/' + firename, fn, cssname);
  };

  //å›¾ç‰‡é¢„åŠ è½½
  Layui.prototype.img = function(url, callback, error) {
    var img = new Image();
    img.src = url;
    if(img.complete){
      return callback(img);
    }
    img.onload = function(){
      img.onload = null;
      callback(img);
    };
    img.onerror = function(e){
      img.onerror = null;
      error(e);
    };
  };

  //å…¨å±€é…ç½®
  Layui.prototype.config = function(options){
    options = options || {};
    for(var key in options){
      config[key] = options[key];
    }
    return this;
  };

  //è®°å½•å…¨éƒ¨æ¨¡å—
  Layui.prototype.modules = function(){
    var clone = {};
    for(var o in modules){
      clone[o] = modules[o];
    }
    return clone;
  }();

  //æ‹“å±•æ¨¡å—
  Layui.prototype.extend = function(options){
    var that = this;

    //éªŒè¯æ¨¡å—æ˜¯å¦è¢«å ç”¨
    options = options || {};
    for(var o in options){
      if(that[o] || that.modules[o]){
        error('\u6A21\u5757\u540D '+ o +' \u5DF2\u88AB\u5360\u7528');
      } else {
        that.modules[o] = options[o];
      }
    }

    return that;
  };

  //è·¯ç”±è§£æž
  Layui.prototype.router = function(hash){
    var that = this
    ,hash = hash || location.hash
    ,data = {
      path: []
      ,search: {}
      ,hash: (hash.match(/[^#](#.*$)/) || [])[1] || ''
    };

    if(!/^#\//.test(hash)) return data; //ç¦æ­¢éžè·¯ç”±è§„èŒƒ
    hash = hash.replace(/^#\//, '').replace(/([^#])(#.*$)/, '$1').split('/') || [];

    //æå–Hashç»“æž„
    that.each(hash, function(index, item){
      /^\w+=/.test(item) ? function(){
        item = item.split('=');
        data.search[item[0]] = item[1];
      }() : data.path.push(item);
    });

    return data;
  };

  //æœ¬åœ°å­˜å‚¨
  Layui.prototype.data = function(table, settings){
    table = table || 'layui';

    if(!win.JSON || !win.JSON.parse) return;

    //å¦‚æžœsettingsä¸ºnullï¼Œåˆ™åˆ é™¤è¡¨
    if(settings === null){
      return delete localStorage[table];
    }

    settings = typeof settings === 'object'
      ? settings
    : {key: settings};

    try{
      var data = JSON.parse(localStorage[table]);
    } catch(e){
      var data = {};
    }

    if(settings.value) data[settings.key] = settings.value;
    if(settings.remove) delete data[settings.key];
    localStorage[table] = JSON.stringify(data);

    return settings.key ? data[settings.key] : data;
  };

  //è®¾å¤‡ä¿¡æ¯
  Layui.prototype.device = function(key){
    var agent = navigator.userAgent.toLowerCase()

    //èŽ·å–ç‰ˆæœ¬å·
    ,getVersion = function(label){
      var exp = new RegExp(label + '/([^\\s\\_\\-]+)');
      label = (agent.match(exp)||[])[1];
      return label || false;
    }

    //è¿”å›žç»“æžœé›†
    ,result = {
      os: function(){ //åº•å±‚æ“ä½œç³»ç»Ÿ
        if(/windows/.test(agent)){
          return 'windows';
        } else if(/linux/.test(agent)){
          return 'linux';
        } else if(/iphone|ipod|ipad|ios/.test(agent)){
          return 'ios';
        } else if(/mac/.test(agent)){
          return 'mac';
        }
      }()
      ,ie: function(){ //ieç‰ˆæœ¬
        return (!!win.ActiveXObject || "ActiveXObject" in win) ? (
          (agent.match(/msie\s(\d+)/) || [])[1] || '11' //ç”±äºŽie11å¹¶æ²¡æœ‰msieçš„æ ‡è¯†
        ) : false;
      }()
      ,weixin: getVersion('micromessenger')  //æ˜¯å¦å¾®ä¿¡
    };

    //ä»»æ„çš„key
    if(key && !result[key]){
      result[key] = getVersion(key);
    }

    //ç§»åŠ¨è®¾å¤‡
    result.android = /android/.test(agent);
    result.ios = result.os === 'ios';

    return result;
  };

  //æç¤º
  Layui.prototype.hint = function(){
    return {
      error: error
    }
  };

  //éåŽ†
  Layui.prototype.each = function(obj, fn){
    var key
    ,that = this;
    if(typeof fn !== 'function') return that;
    obj = obj || [];
    if(obj.constructor === Object){
      for(key in obj){
        if(fn.call(obj[key], key, obj[key])) break;
      }
    } else {
      for(key = 0; key < obj.length; key++){
        if(fn.call(obj[key], key, obj[key])) break;
      }
    }
    return that;
  };

  //å°†æ•°ç»„ä¸­çš„å¯¹è±¡æŒ‰å…¶æŸä¸ªæˆå‘˜æŽ’åº
  Layui.prototype.sort = function(obj, key, desc){
    var clone = JSON.parse(
      JSON.stringify(obj)
    );

    if(!key) return clone;

    //å¦‚æžœæ˜¯æ•°å­—ï¼ŒæŒ‰å¤§å°æŽ’åºï¼Œå¦‚æžœæ˜¯éžæ•°å­—ï¼ŒæŒ‰å­—å…¸åºæŽ’åº
    clone.sort(function(o1, o2){
      var isNum = /^\d+$/
      ,v1 = o1[key]
      ,v2 = o2[key];

      if(isNum.test(v1)) v1 = parseFloat(v1);
      if(isNum.test(v2)) v2 = parseFloat(v2);

      if(v1 && !v2){
        return 1;
      } else if(!v1 && v2){
        return -1;
      }

      if(v1 > v2){
        return 1;
      } else if (v1 < v2) {
        return -1;
      } else {
        return 0;
      }
    });

    desc && clone.reverse(); //å€’åº
    return clone;
  };

  //é˜»æ­¢äº‹ä»¶å†’æ³¡
  Layui.prototype.stope = function(e){
    e = e || win.event;
    e.stopPropagation
      ? e.stopPropagation()
    : e.cancelBubble = true;
  };

  //è‡ªå®šä¹‰æ¨¡å—äº‹ä»¶
  Layui.prototype.onevent = function(modName, events, callback){
    if(typeof modName !== 'string'
    || typeof callback !== 'function') return this;
    config.event[modName + '.' + events] = [callback];

    //ä¸å†å¯¹å¤šæ¬¡äº‹ä»¶ç›‘å¬åšæ”¯æŒ
    /*
    config.event[modName + '.' + events]
      ? config.event[modName + '.' + events].push(callback)
    : config.event[modName + '.' + events] = [callback];
    */

    return this;
  };

  //æ‰§è¡Œè‡ªå®šä¹‰æ¨¡å—äº‹ä»¶
  Layui.prototype.event = function(modName, events, params){
    var that = this
    ,result = null
    ,filter = events.match(/\(.*\)$/)||[] //æå–äº‹ä»¶è¿‡æ»¤å™¨
    ,set = (events = modName + '.'+ events).replace(filter, '') //èŽ·å–äº‹ä»¶æœ¬ä½“å
    ,callback = function(_, item){
      var res = item && item.call(that, params);
      res === false && result === null && (result = false);
    };
    layui.each(config.event[set], callback);
    filter[0] && layui.each(config.event[events], callback); //æ‰§è¡Œè¿‡æ»¤å™¨ä¸­çš„äº‹ä»¶
    return result;
  };

  win.layui = new Layui();

}(window);
