import jsBase64 from 'js-base64';
const {Base64} = jsBase64;

const cefQuery: (p: object) => void = (window as any).cefQuery;
let qb: any = null;
type SuccessType = (res: any) => any;
type FailType = (
  code?: string | number,
  message?: string
) => any | ((error?: object) => any);
export const inQb = () => !!(window as any).cefQuery;

export const inQbBrowser = () => !!(window as any).QBbrowser;

if (inQbBrowser()) {
  qb = new (window as any).QBbrowser();
}

export const api = (
  funcName: string,
  reqStr: string,
  success?: SuccessType,
  failure?: FailType
) => {
  if (!inQb()) {
    return;
  }
  cefQuery({
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
export const getUser = (success?: SuccessType, failure?: FailType) => {
  var reqStr = '["req_cache",[{"data":"UserInfo"}]]';
  api(
    'getUser',
    reqStr,
    (res) => {
      let user = JSON.parse(res);
      (success as any)({
        id: user.UserId,
        username: user.UserAccount,
        password: user.Password
      });
    },
    failure
  );
};

// 打开QB精简报价
export const openQbQuoteWindow = (
  bondInfo: any,
  success?: SuccessType,
  failure?: FailType
) => {
  const reqStr = `["open_page", [{"name":"bond_short_quote","bondkey":"${bondInfo.bondkey}","listmarket":"${bondInfo.listedmarket}"}]]`;
  api(
    'openQbQuoteWindow',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      (success as any)(result);
    },
    failure
  );
};

// 打开QB价格试算
export const openQbCalculateWindow = (
  bondInfo: any,
  success?: SuccessType,
  failure?: FailType
) => {
  var reqStr = `["open_page", [{"name":"bondcalculate","bondkey":"${bondInfo.bondkey}","listmarket":"${bondInfo.listedmarket}"}]]`;
  api(
    'openQbCalculateWindow',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      (success as any)(result);
    },
    failure
  );
};

// 查询QB版本
export const getQbVersion = (success?: SuccessType, failure?: any) => {
  const reqStr = `["req_cache", [{"data":"Version"}]]`;
  api(
    'getQbVersion',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      (success as any)({
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
export const getChangeBondResult = (
  bondInfo: any,
  success?: SuccessType,
  failure?: any
) => {
  const reqStr = `["change_bond", [{"bondkey":"${bondInfo.bondkey}.${bondInfo.listedmarket}"}]]`;
  api(
    'getChangeBondResult',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      (success as any)({
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
export const openNewBondDetail = (
  bondInfo: any,
  success?: SuccessType,
  failure?: FailType
) => {
  const reqStr = `["open_page", [{"name":"bond_detail","bondkey":"${bondInfo.bondkey}","listmarket":"${bondInfo.listedmarket}"}]]`;
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
export const getBondAttention = (
  bondInfo: any,
  success?: SuccessType,
  failure?: any
) => {
  const reqStr = `["req_cache", [{"data":"BondAttention","callback":"handleManageAttention","BondKey":"${bondInfo.bondkey}","ListedMarket":"${bondInfo.listedmarket}","Todo":"Check"}]]`;
  api(
    'getBondAttention',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      (success as any)(result);
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
export const modifyBondAttention = (
  bondInfo: any,
  success?: SuccessType,
  failure?: any
) => {
  const reqStr = `["req_cache", [{"data":"BondAttention","callback":"handleManageAttention","BondKey":"${bondInfo.bondkey}","ListedMarket":"${bondInfo.listedmarket}","Todo":"Modify"}]]`;
  api(
    'modifyBondAttention',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      (success as any)(result);
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
export const reqAttention = (success?: SuccessType, failure?: FailType) => {
  if (qb) {
    qb.getCommon(
      ['tds_req', {type: 'tds.req.system.attention'}, ''],
      (res: any) => {
        console.log(res);
      },
      (error_code: any, error_message: any) => {
        console.log(error_code, error_message);
      }
    );
  } else {
    (window as any).tds_reqAttention = function(result: any) {
      var {group} = result || {};
      typeof success === 'function' && (success as any)(group || []);
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

export const reqMemberInfo = (callback: any, timeout: any) => {
  let timer: any;

  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  (window as any).tds_reqMemberInfo = function(result: any) {
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
export const openPage = function(pageInfo: any) {
  pageInfo = pageInfo || {};
  if (!pageInfo.name) {
    return;
  }
  var req = ['open_page', [pageInfo]];
  api('open_page', JSON.stringify(req), (res) => {
    console.log(`open qb page ${pageInfo.name}`, res);
  });
};
