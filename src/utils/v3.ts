import axios from 'axios';
import { readFileSync } from 'fs';
import { createSign as _createSign } from 'crypto';
import * as path from 'path';

/**
 * 生成随机字符串
 * @param {number} len 字符串长度
 */
function createRandomString(len) {
  const data = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let str = '';
  for (let i = 0; i < len; i++) {
    str += data.charAt(Math.floor(Math.random() * data.length));
  }
  return str;
}

/**
 * 微信支付v3 签名生成
 * @param {string} method 请求方法
 * @param {string} url
 * @param {number} timestamp 时间戳 秒级
 * @param {string} nonce_str 随机字符串
 * @param {Object} order 主体信息
 */
function createSign(method, url, timestamp, nonce_str, order) {
  const signStr = `${method}\n${url}\n${timestamp}\n${nonce_str}\n${JSON.stringify(
    order,
  )}\n`;
  const cert = readFileSync(
    path.resolve(__dirname, '../secret/apiclientkey.pem'),
    'utf-8',
  );
  const sign = _createSign('RSA-SHA256');
  sign.update(signStr);
  return sign.sign(cert, 'base64');
}

/**
 * 微信支付v3
 * @param {Object} order 订单信息
 */
function v3Pay(order, serial_no) {
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const nonce_str = createRandomString(32);
  const signature = createSign(
    'POST',
    '/v3/pay/transactions/native',
    timestamp,
    nonce_str,
    order,
  );
  const Authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${order.mchid}",nonce_str="${nonce_str}",timestamp="${timestamp}",signature="${signature}",serial_no="${serial_no}"`;
  console.log(Authorization);
  axios
    .post('https://api.mch.weixin.qq.com/v3/pay/transactions/native', order, {
      headers: { Authorization },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  return {
    timeStamp: String(timestamp),
    paySign: signature,
    nonceStr: nonce_str,
    package: '',
    signType: 'MD5',
  };
}
// const v3Pay = () => {};
export { v3Pay };
/**
 * github： https://github.com/yjiewei/payment-demo 感谢大哥的仓库和尚硅谷提供的账号
 */
// const order = {
//   appid: 'wx74862e0dfcf69954', // appid
//   mchid: '1558950191', // 商户号
//   description: '测试支付',
//   out_trade_no: 'wzm20231020912211',
//   amount: {
//     total: 1,
//   },
//   notify_url: 'https://xxx.cn/',
// };
// v3Pay(order, '34345964330B66427E0D3D28826C4993C77E631F'); // 证书编号，在商户后台申请证书后会有编号
