var Base64 = require('js-base64').Base64;

var inQb = () => !!window.cefQuery;

var inQbBrowser = () => !!window.QBbrowser;

var api = (funcName, reqStr, success, failure) => {
  if (!inQb()) {
    return;
  }
  window.cefQuery({
    request: reqStr,
    onSuccess:
      success ||
      function(response) {
        console.info(response);
      },
    onFailure:
      failure ||
      function(errorCode, errorMessage) {
        console.info(funcName + ' : ' + errorMessage);
      }
  });
};

// 获取QB登录用户信息
var getUser = (success, failure) => {
  var reqStr = '["req_cache",[{"data":"UserInfo"}]]';
  api(
    'getUser',
    reqStr,
    (res) => {
      let user = JSON.parse(res);
      success({
        id: user.UserId,
        username: user.UserAccount,
        password: user.Password
      });
    },
    failure
  );
};

// 打开QB精简报价
var openQbQuoteWindow = (bondInfo, success, failure) => {
  var reqStr = `["open_page", [{"name":"bond_short_quote","bondkey":"${bondInfo.bondkey}","listmarket":"${bondInfo.listedmarket}"}]]`;
  api(
    'openQbQuoteWindow',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      success(result);
    },
    failure
  );
};

// 打开QB价格试算
var openQbCalculateWindow = (bondInfo, success, failure) => {
  var reqStr = `["open_page", [{"name":"bondcalculate","bondkey":"${bondInfo.bondkey}","listmarket":"${bondInfo.listedmarket}"}]]`;
  api(
    'openQbCalculateWindow',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      success(result);
    },
    failure
  );
};

// 查询QB版本
var getQbVersion = (success, failure) => {
  var reqStr = `["req_cache", [{"data":"Version"}]]`;
  api(
    'getQbVersion',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      success({
        version: result.version
      });
    },
    (error_code, error_message) => {
      failure({
        errorCode: error_code,
        errorMessage: error_message
      });
    }
  );
};

// 查询是否可切换至指定债券
var getChangeBondResult = (bondInfo, success, failure) => {
  var reqStr = `["change_bond", [{"bondkey":"${bondInfo.bondkey}.${bondInfo.listedmarket}"}]]`;
  api(
    'getChangeBondResult',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      success({
        changed: result.changed
      });
    },
    (error_code, error_message) => {
      failure({
        errorCode: error_code,
        errorMessage: error_message
      });
    }
  );
};

// 打开新的债券详情tab页
var openNewBondDetail = (bondInfo, success, failure) => {
  var reqStr = `["open_page", [{"name":"bond_detail","bondkey":"${bondInfo.bondkey}","listmarket":"${bondInfo.listedmarket}"}]]`;
  api(
    'openQbQuoteWindow',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      console.log('调用打开新tab接口：', result);
    },
    failure
  );
};

// 查询当前债券是否存在关注组
var getBondAttention = (bondInfo, success, failure) => {
  var reqStr = `["req_cache", [{"data":"BondAttention","callback":"handleManageAttention","BondKey":"${bondInfo.bondkey}","ListedMarket":"${bondInfo.listedmarket}","Todo":"Check"}]]`;
  api(
    'getBondAttention',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      success(result);
    },
    (error_code, error_message) => {
      failure({
        errorCode: error_code,
        errorMessage: error_message
      });
    }
  );
};

// 管理当前债券关注组
var modifyBondAttention = (bondInfo, success, failure) => {
  var reqStr = `["req_cache", [{"data":"BondAttention","callback":"handleManageAttention","BondKey":"${bondInfo.bondkey}","ListedMarket":"${bondInfo.listedmarket}","Todo":"Modify"}]]`;
  api(
    'modifyBondAttention',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      success(result);
    },
    (error_code, error_message) => {
      failure({
        errorCode: error_code,
        errorMessage: error_message
      });
    }
  );
};

// 获取我的关注组
var reqAttention = (success, failure) => {
  if (__instance().qb) {
    __instance().qb.getCommon(
      ['tds_req', {type: 'tds.req.system.attention'}, ''],
      (res) => {
        console.log(res);
      },
      (error_code, error_message) => {
        console.log(error_code, error_message);
      }
    );
  } else {
    window.tds_reqAttention = function(result) {
      var {group} = result || {};
      typeof success === 'function' && success(group || []);
    };
    var reqStr = `["tds_req", [{"req": "${Base64.encode(
      JSON.stringify({type: 'tds.req.system.attention'})
    )}", "callback": "${Base64.encode('tds_reqAttention')}"}]]`;
    api(
      'reqAttention',
      reqStr,
      (res) => {
        console.log(res);
      },
      (code, message) => {
        console.log(code, message);
      }
    );
  }
};

var reqMemberInfo = (callback, timeout) => {
  let timer;

  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  window.tds_reqMemberInfo = function(result) {
    clear();
    typeof callback === 'function' && callback(result);
  };

  if (timeout) {
    timer = setTimeout(() => {
      clear();
      typeof callback === 'function' && callback();
    }, timeout);
  }
  var type = 'tds.req.system.user.member.info';
  var reqStr = `["tds_req", [{"req": "${Base64.encode(
    JSON.stringify({type: type})
  )}", "callback": "${Base64.encode('tds_reqMemberInfo')}"}]]`;
  api(
    'reqMemberInfo',
    reqStr,
    (res) => {
      console.log('reqMemberInfo : ', res);
    },
    (code, message) => {
      console.log('reqMemberInfo : ', code, message);
    }
  );
};
var openPage = function(pageInfo) {
  pageInfo = pageInfo || {};
  if (!pageInfo.name) {
    return;
  }
  var req = ['open_page', [pageInfo]];
  api('open_page', JSON.stringify(req), (res) => {
    console.log(`open qb page ${pageInfo.name}`, res);
  });
};

module.exports.api = api;
module.exports.inQb = inQb;
module.exports.inQbBrowser = inQbBrowser;
module.exports.getUser = getUser;
module.exports.openQbQuoteWindow = openQbQuoteWindow;
module.exports.getQbVersion = getQbVersion;
module.exports.getChangeBondResult = getChangeBondResult;
module.exports.openNewBondDetail = openNewBondDetail;
module.exports.getBondAttention = getBondAttention;
module.exports.modifyBondAttention = modifyBondAttention;
module.exports.reqAttention = reqAttention;
module.exports.reqMemberInfo = reqMemberInfo;
module.exports.openPage = openPage;
