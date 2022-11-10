// eslint-disable
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  constructor(username, password, num) {
    let callid = -100;
    let ws1 = new WebSocket("ws://127.0.0.1:10008/appproxy/ext/eisenstecken.konvoicepro.eu/PBX0/APPCLIENT/132772/websocket");
    let ws2 = null;
    const log = {innerHTML: ""};

    //   const username = "u1074_hannes"; // Username of the to the desk phone registered device
//    let password = "36x!v8BHZ:_7";

    const app = "phone";
    const userAgent = "myApps (Chrome)";

    let user = "";
    let domain = "";
    let challenge = "";
    let nonce = "";
    let dn = "";
    let phone = "";
    let guid = "";
    let digest = "";
    let loginError = "";
    let dev = "";
    let activeCall = null;
    let activeCallSetup = null;
    let sessionUsername = "";
    let sessionPassword = "";

    function decrypt(key, data) {
      var keyBytes = new textEncode(key);
      var arr = rc4Bytes(keyBytes, hex2bin(data));
      return byteArrayToString(arr);
    }

    ws1.onmessage = (payload) => {
      let obj = JSON.parse(payload.data);
      if (obj) {
        if (obj.mt === "Authenticate") {
          log.innerHTML = log.innerHTML + "<br />" + "<p>Authenticate with " + username + " : " + password + "</p>";
          domain = obj.domain;
          challenge = obj.challenge;
          nonce = ("0000000" + (Math.ceil(Math.random() * 0xffffffff)).toString(16)).substr(-8) + ("0000000" + (Math.ceil(Math.random() * 0xffffffff)).toString(16)).substr(-8);
          if (obj.method === "digest") {
            ws1.send(JSON.stringify({
              mt: "Login",
              type: obj.type,
              method: obj.method,
              username: username,
              nonce: nonce,
              response: SHA256("innovaphoneAppClient:" + obj.type + ":" + domain + ":" + username + ":" + password + ":" + nonce + ":" + challenge),
              userAgent: userAgent
            }));
          } else if (obj.method === "ntlm") {
            ws1.send(JSON.stringify({
              mt: "Login",
              type: obj.type,
              method: obj.method,
              username: username,
              nonce: nonce,
              response: ntlmResponse(password, challenge),
              userAgent: userAgent
            }));
            password = ntlmSessionKey(password);
          }
        } else if (obj.mt === "CheckBuildResult") {
          ws1.send(JSON.stringify({mt: "SubscribeRegister"}));
        } else if (obj.mt === "UpdateRegister") {
          ws1.send(JSON.stringify({
            "mt": "Login",
            "type": "user",
            "userAgent": userAgent
          }));
        } else if (obj.mt === "LoginResult") {
          if (obj.error) {
            loginError = obj.error;
            log.innerHTML = log.innerHTML + "<br />" + "<p>Authentication failed " + loginError + "</p>";
            // Handle login error
          } else {
            digest = SHA256("innovaphoneAppClient:loginresult:" + domain + ":" + username + ":" + password + ":" + nonce + ":" + challenge + ":" + JSON.stringify(obj.info));
            if (digest === obj.digest) {
              guid = obj.info.user.guid;
              if (obj.info && obj.info.session && obj.info.session.usr && obj.info.session.pwd) {
                sessionUsername = decrypt("innovaphoneAppClient:usr:" + nonce + ":" + password, obj.info.session.usr);
                sessionPassword = decrypt("innovaphoneAppClient:pwd:" + nonce + ":" + password, obj.info.session.pwd);
              } else {
                sessionUsername = username;
                sessionPassword = password;
              }

            }
            log.innerHTML = log.innerHTML + "<br />" + "<p>Authenticated, get phone APP</p>";

            ws1.send(JSON.stringify({mt: 'SubscribeApps'}));
          }
        } else if (obj.mt === "UpdateAppsInfo" && obj.app.title === "Phone") {
          dev = obj.app.name;
          log.innerHTML = log.innerHTML + "<br />" + "<p>Phone App found: " + dev + "</p>";
          ws2 = new WebSocket("ws://127.0.0.1:10008/appproxy/ext/eisenstecken.konvoicepro.eu/PBX0/APPS/phone/132772/websocket");
          ws2.onmessage = (payload) => {
            let obj = JSON.parse(payload.data);
            if (obj) {
              if (obj.mt === "AppChallengeResult") {
                ws1.send(JSON.stringify({
                  "mt": "AppGetLogin",
                  "app": dev,
                  "challenge": obj.challenge,
                  "src": "1"
                }));
              } else if (obj.mt === "AppLoginResult" && obj.ok) {
                ws2.send(JSON.stringify({
                  "mt": "CheckBuild",
                  "url": "http://127.0.0.1:10008/appproxy/ext/eisenstecken.konvoicepro.eu/PBX0/APPS/phone/132772/phone.htm"
                }));
              } else if (obj.mt === "CheckBuildResult") {
                ws2.send(JSON.stringify({
                  "mt": "Attach",
                  "api": "EpSignal",
                  "hw": dev.split(":")[1],
                  "disc": true
                }));
              } else if (obj.mt === "AttachResult") {
                phone = obj;
                ws2.send(JSON.stringify({
                  "api": "PbxApi",
                  "mt": "SubscribeProfile"
                }));
              } else if (obj.mt === "SubscribeProfileResult") {
                window.setInterval(() => {
                  ws2.send(JSON.stringify({
                    "mt": "KeepAlive"
                  }));
                }, 60000);
                log.innerHTML = log.innerHTML + "<br />" + "<p>" + "Logged in to Phone App, all set up, you can Call!" + "</p>";


                num = normalizeE164(num);
                let flags = null;
                if (num[0] === '+' || num[0] === 'I') {
                  num = num.substring(1);
                  flags = 'I';
                }
                log.innerHTML = log.innerHTML + "<br />" + "<p>Call " + input.value + "</p>";
                activeCall = Object.assign({mt: "Signaling", api: "EpSignal", to: true}, {
                  call: callid,
                  sig: {
                    type: "setup",
                    cg: {flags, num},
                    complete: true,
                    channel: -1,
                    fty: [{type: "innovaphone_remote_control", control: "CONNECT"}],
                    channels: {source: "REMOTE"}
                  }
                });
                callid++;
                ws2.send(JSON.stringify(activeCall));



              } else if (obj.mt === "Signaling" && !!activeCall && obj.sig && obj.call) {
                if (obj.sig.type === 'setup') {
                  obj.fromPBX = !!obj.to;
                  obj.fromEP = !obj.to;
                  activeCallSetup = obj;
                  ws2.send(JSON.stringify({
                    "mt": "Signaling",
                    "api": "EpSignal",
                    "to": true,
                    "call": obj.call,
                    "sig": {
                      "type": "setup_ack"
                    }
                  }));
                  ws2.send(JSON.stringify(obj));
                } else if (obj.sig.type === "rel" && obj.call !== activeCall.call) {
                  ws2.send(JSON.stringify(Object.assign(obj, {"fromEP": true})));
                } else if (obj.sig.type === "conn" && activeCall.call === obj.call) {
                  if (obj.sig.channels_cmd === "PROPOSAL") {
                    ws2.send(JSON.stringify({
                      "mt": "Signaling",
                      "api": "EpSignal",
                      "to": true,
                      "call": activeCall.call,
                      "sig": {
                        "type": "facility",
                        "fty": [
                          {
                            "type": "ct_initiate",
                            "dst": {
                              "flags": activeCall.sig.cg.flags,
                              "num": activeCall.sig.cg.num
                            }
                          }
                        ]
                      }
                    }));
                  }
                } else if (obj.sig.type === "facility") {
                  ws2.send(JSON.stringify(Object.assign(obj, {"fromPBX": true})));
                } else if (obj.sig.type === "call_proc") {
                  ws2.send(JSON.stringify(Object.assign(obj, {
                    "fromPBX": true,
                    "fromEP": false
                  })));
                }
              }
            }
          }
          ws2.onopen = () => {
            log.innerHTML = log.innerHTML + "<br />" + "<p>Connected to Phone App</p>";
            ws2.send(JSON.stringify({
              "mt": "AppChallenge",
            }));
          }

          ws2.onclose = () => {
            log.innerHTML = log.innerHTML + "<br />" + "<p>" + "Phone App disconnected!" + "</p>";

          }
        } else if (obj.mt === "AppGetLoginResult") {
          digest = obj.digest;
          guid = obj.guid;
          dn = obj.dn;
          log.innerHTML = log.innerHTML + "<br />" + "<p>Login to Phone App</p>";
          ws2.send(JSON.stringify({
            "mt": "AppLogin",
            "app": "phone",
            "domain": "eisenstecken.konvoicepro.eu",
            "sip": username,
            "guid": guid,
            "dn": dn,
            "info": obj.info,
            "digest": digest,
            "pbxObj": dev
          }))
        } else {
          //  log.innerHTML = log.innerHTML + "<br />" + "<p>" + JSON.stringify(payload.data) + "</p>";
        }
      }
    }

    ws1.onopen = () => {
      log.innerHTML = log.innerHTML + "<br />" + "<p>Connected to myApps</p>";
      ws1.send(JSON.stringify({
        "mt": "CheckBuild",
        "url": "http://127.0.0.1:10008/appproxy/ext/eisenstecken.konvoicepro.eu/PBX0/APPCLIENT/132772/appclient.htm"
      }));
    }
    ws1.onclose = () => {
      log.innerHTML = log.innerHTML + "<br />" + "<p>" + "myApps disconnected!" + "</p>";

    }

  }


}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}
if (!String.prototype.insert) {
  String.prototype.insert = function (index, string) {
    if (index > 0)
      return this.substring(0, index) + string + this.substring(index, this.length);
    else
      return string + this;
  };
}
String.prototype.startsWith = function (str) {
  return this.indexOf(str) == 0;
};

String.prototype.endsWith = function (suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.replaceAll = function (search, replace) {
  let replacer = new RegExp(search, "g");
  return this.replace(replacer, replace);
}


function str2hex(input) {
  function d2h(d) {
    let r = d.toString(16);
    if (r.length < 2) r = "0" + r;
    return r;
  }

  let tmp = input;
  let str = '';
  for (let i = 0; i < tmp.length; i++) {
    let c = tmp.charCodeAt(i);
    str += d2h(c);
  }
  return str;
}

function hex2str(input) {
  let hex = input.toString();
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

/**
 *
 *  Secure Hash Algorithm (SHA1)
 *  http://www.webtoolkit.info/
 *
 **/
function SHA1(msg) {

  function rotateLeft(n, s) {
    let t4 = (n << s) | (n >>> (32 - s));
    return t4;
  };

  function lsbHex(val) {
    let str = "";
    let i;
    let vh;
    let vl;

    for (i = 0; i <= 6; i += 2) {
      vh = (val >>> (i * 4 + 4)) & 0x0f;
      vl = (val >>> (i * 4)) & 0x0f;
      str += vh.toString(16) + vl.toString(16);
    }
    return str;
  };

  function cvtHex(val) {
    let str = "";
    let i;
    let v;

    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f;
      str += v.toString(16);
    }
    return str;
  };


  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    return unescape(encodeURIComponent(string));
  };

  let blockstart;
  let i, j;
  let W = new Array(80);
  let H0 = 0x67452301;
  let H1 = 0xEFCDAB89;
  let H2 = 0x98BADCFE;
  let H3 = 0x10325476;
  let H4 = 0xC3D2E1F0;
  let A, B, C, D, E;
  let temp;

  msg = Utf8Encode(msg);

  let msgLen = msg.length;

  let wordArray = new Array();
  for (i = 0; i < msgLen - 3; i += 4) {
    j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
      msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
    wordArray.push(j);
  }

  switch (msgLen % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = msg.charCodeAt(msgLen - 1) << 24 | 0x0800000;
      break;

    case 2:
      i = msg.charCodeAt(msgLen - 2) << 24 | msg.charCodeAt(msgLen - 1) << 16 | 0x08000;
      break;

    case 3:
      i = msg.charCodeAt(msgLen - 3) << 24 | msg.charCodeAt(msgLen - 2) << 16 | msg.charCodeAt(msgLen - 1) << 8 | 0x80;
      break;
  }

  wordArray.push(i);

  while ((wordArray.length % 16) != 14) wordArray.push(0);

  wordArray.push(msgLen >>> 29);
  wordArray.push((msgLen << 3) & 0x0ffffffff);


  for (blockstart = 0; blockstart < wordArray.length; blockstart += 16) {

    for (i = 0; i < 16; i++) W[i] = wordArray[blockstart + i];
    for (i = 16; i <= 79; i++) W[i] = rotateLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;

    for (i = 0; i <= 19; i++) {
      temp = (rotateLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotateLeft(B, 30);
      B = A;
      A = temp;
    }

    for (i = 20; i <= 39; i++) {
      temp = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotateLeft(B, 30);
      B = A;
      A = temp;
    }

    for (i = 40; i <= 59; i++) {
      temp = (rotateLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotateLeft(B, 30);
      B = A;
      A = temp;
    }

    for (i = 60; i <= 79; i++) {
      temp = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotateLeft(B, 30);
      B = A;
      A = temp;
    }

    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;

  }

  let temp = cvtHex(H0) + cvtHex(H1) + cvtHex(H2) + cvtHex(H3) + cvtHex(H4);

  return temp.toLowerCase();
}

/**
 *
 *  Secure Hash Algorithm (SHA256)
 *  http://www.webtoolkit.info/
 *
 *  Original code by Angel Marin, Paul Johnston.
 *
 **/

function SHA256(s) {

  let chrsz = 8;
  let hexcase = 0;

  function safeAdd(x, y) {
    let lsw = (x & 0xFFFF) + (y & 0xFFFF);
    let msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  function S(X, n) {
    return (X >>> n) | (X << (32 - n));
  }

  function R(X, n) {
    return (X >>> n);
  }

  function Ch(x, y, z) {
    return ((x & y) ^ ((~x) & z));
  }

  function Maj(x, y, z) {
    return ((x & y) ^ (x & z) ^ (y & z));
  }

  function Sigma0256(x) {
    return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
  }

  function Sigma1256(x) {
    return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
  }

  function Gamma0256(x) {
    return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
  }

  function Gamma1256(x) {
    return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
  }

  function coreSha256(m, l) {
    let K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
    let HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    let W = new Array(64);
    let a, b, c, d, e, f, g, h, i, j;
    let T1, T2;

    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;

    for (let i = 0; i < m.length; i += 16) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];

      for (let j = 0; j < 64; j++) {
        if (j < 16) W[j] = m[j + i];
        else W[j] = safeAdd(safeAdd(safeAdd(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

        T1 = safeAdd(safeAdd(safeAdd(safeAdd(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
        T2 = safeAdd(Sigma0256(a), Maj(a, b, c));

        h = g;
        g = f;
        f = e;
        e = safeAdd(d, T1);
        d = c;
        c = b;
        b = a;
        a = safeAdd(T1, T2);
      }

      HASH[0] = safeAdd(a, HASH[0]);
      HASH[1] = safeAdd(b, HASH[1]);
      HASH[2] = safeAdd(c, HASH[2]);
      HASH[3] = safeAdd(d, HASH[3]);
      HASH[4] = safeAdd(e, HASH[4]);
      HASH[5] = safeAdd(f, HASH[5]);
      HASH[6] = safeAdd(g, HASH[6]);
      HASH[7] = safeAdd(h, HASH[7]);
    }
    return HASH;
  }

  function str2binb(str) {
    let bin = Array();
    let mask = (1 << chrsz) - 1;
    for (let i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
    }
    return bin;
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    return unescape(encodeURIComponent(string));
  };

  function binb2hex(binarray) {
    let hexTab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    let str = "";
    for (let i = 0; i < binarray.length * 4; i++) {
      str += hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
        hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return str;
  }

  s = Utf8Encode(s);
  return binb2hex(coreSha256(str2binb(s), s.length * chrsz));
}

/*
 * RC4 symmetric cipher encryption/decryption
 *
 * https://gist.github.com/farhadi/2185197#file-rc4-js
 *
 * @license Public Domain
 * @param string key - secret key for encryption/decryption
 * @param string str - string to be encrypted/decrypted
 * @return string
 */
function rc4(key, str) {
  let s = [], j = 0, x, res = '';
  for (let i = 0; i < 256; i++) {
    s[i] = i;
  }
  for (i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
  }
  i = 0;
  j = 0;
  for (let y = 0; y < str.length; y++) {
    i = (i + 1) % 256;
    j = (j + s[i]) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
    res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
  }
  return res;
}

/*
 * Paul Tero, July 2001
 * http://www.tero.co.uk/des/
 *
 * Optimised for performance with large blocks by Michael Hayworth, November 2001
 * http://www.netdealing.com
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 *
 * Code reformatted by innovaphone
 */

function des(key, message, encrypt, mode, iv, padding) {
  let spfunction1 = new Array(0x1010400, 0, 0x10000, 0x1010404, 0x1010004, 0x10404, 0x4, 0x10000, 0x400, 0x1010400, 0x1010404, 0x400, 0x1000404, 0x1010004, 0x1000000, 0x4, 0x404, 0x1000400, 0x1000400, 0x10400, 0x10400, 0x1010000, 0x1010000, 0x1000404, 0x10004, 0x1000004, 0x1000004, 0x10004, 0, 0x404, 0x10404, 0x1000000, 0x10000, 0x1010404, 0x4, 0x1010000, 0x1010400, 0x1000000, 0x1000000, 0x400, 0x1010004, 0x10000, 0x10400, 0x1000004, 0x400, 0x4, 0x1000404, 0x10404, 0x1010404, 0x10004, 0x1010000, 0x1000404, 0x1000004, 0x404, 0x10404, 0x1010400, 0x404, 0x1000400, 0x1000400, 0, 0x10004, 0x10400, 0, 0x1010004);
  let spfunction2 = new Array(-0x7fef7fe0, -0x7fff8000, 0x8000, 0x108020, 0x100000, 0x20, -0x7fefffe0, -0x7fff7fe0, -0x7fffffe0, -0x7fef7fe0, -0x7fef8000, -0x80000000, -0x7fff8000, 0x100000, 0x20, -0x7fefffe0, 0x108000, 0x100020, -0x7fff7fe0, 0, -0x80000000, 0x8000, 0x108020, -0x7ff00000, 0x100020, -0x7fffffe0, 0, 0x108000, 0x8020, -0x7fef8000, -0x7ff00000, 0x8020, 0, 0x108020, -0x7fefffe0, 0x100000, -0x7fff7fe0, -0x7ff00000, -0x7fef8000, 0x8000, -0x7ff00000, -0x7fff8000, 0x20, -0x7fef7fe0, 0x108020, 0x20, 0x8000, -0x80000000, 0x8020, -0x7fef8000, 0x100000, -0x7fffffe0, 0x100020, -0x7fff7fe0, -0x7fffffe0, 0x100020, 0x108000, 0, -0x7fff8000, 0x8020, -0x80000000, -0x7fefffe0, -0x7fef7fe0, 0x108000);
  let spfunction3 = new Array(0x208, 0x8020200, 0, 0x8020008, 0x8000200, 0, 0x20208, 0x8000200, 0x20008, 0x8000008, 0x8000008, 0x20000, 0x8020208, 0x20008, 0x8020000, 0x208, 0x8000000, 0x8, 0x8020200, 0x200, 0x20200, 0x8020000, 0x8020008, 0x20208, 0x8000208, 0x20200, 0x20000, 0x8000208, 0x8, 0x8020208, 0x200, 0x8000000, 0x8020200, 0x8000000, 0x20008, 0x208, 0x20000, 0x8020200, 0x8000200, 0, 0x200, 0x20008, 0x8020208, 0x8000200, 0x8000008, 0x200, 0, 0x8020008, 0x8000208, 0x20000, 0x8000000, 0x8020208, 0x8, 0x20208, 0x20200, 0x8000008, 0x8020000, 0x8000208, 0x208, 0x8020000, 0x20208, 0x8, 0x8020008, 0x20200);
  let spfunction4 = new Array(0x802001, 0x2081, 0x2081, 0x80, 0x802080, 0x800081, 0x800001, 0x2001, 0, 0x802000, 0x802000, 0x802081, 0x81, 0, 0x800080, 0x800001, 0x1, 0x2000, 0x800000, 0x802001, 0x80, 0x800000, 0x2001, 0x2080, 0x800081, 0x1, 0x2080, 0x800080, 0x2000, 0x802080, 0x802081, 0x81, 0x800080, 0x800001, 0x802000, 0x802081, 0x81, 0, 0, 0x802000, 0x2080, 0x800080, 0x800081, 0x1, 0x802001, 0x2081, 0x2081, 0x80, 0x802081, 0x81, 0x1, 0x2000, 0x800001, 0x2001, 0x802080, 0x800081, 0x2001, 0x2080, 0x800000, 0x802001, 0x80, 0x800000, 0x2000, 0x802080);
  let spfunction5 = new Array(0x100, 0x2080100, 0x2080000, 0x42000100, 0x80000, 0x100, 0x40000000, 0x2080000, 0x40080100, 0x80000, 0x2000100, 0x40080100, 0x42000100, 0x42080000, 0x80100, 0x40000000, 0x2000000, 0x40080000, 0x40080000, 0, 0x40000100, 0x42080100, 0x42080100, 0x2000100, 0x42080000, 0x40000100, 0, 0x42000000, 0x2080100, 0x2000000, 0x42000000, 0x80100, 0x80000, 0x42000100, 0x100, 0x2000000, 0x40000000, 0x2080000, 0x42000100, 0x40080100, 0x2000100, 0x40000000, 0x42080000, 0x2080100, 0x40080100, 0x100, 0x2000000, 0x42080000, 0x42080100, 0x80100, 0x42000000, 0x42080100, 0x2080000, 0, 0x40080000, 0x42000000, 0x80100, 0x2000100, 0x40000100, 0x80000, 0, 0x40080000, 0x2080100, 0x40000100);
  let spfunction6 = new Array(0x20000010, 0x20400000, 0x4000, 0x20404010, 0x20400000, 0x10, 0x20404010, 0x400000, 0x20004000, 0x404010, 0x400000, 0x20000010, 0x400010, 0x20004000, 0x20000000, 0x4010, 0, 0x400010, 0x20004010, 0x4000, 0x404000, 0x20004010, 0x10, 0x20400010, 0x20400010, 0, 0x404010, 0x20404000, 0x4010, 0x404000, 0x20404000, 0x20000000, 0x20004000, 0x10, 0x20400010, 0x404000, 0x20404010, 0x400000, 0x4010, 0x20000010, 0x400000, 0x20004000, 0x20000000, 0x4010, 0x20000010, 0x20404010, 0x404000, 0x20400000, 0x404010, 0x20404000, 0, 0x20400010, 0x10, 0x4000, 0x20400000, 0x404010, 0x4000, 0x400010, 0x20004010, 0, 0x20404000, 0x20000000, 0x400010, 0x20004010);
  let spfunction7 = new Array(0x200000, 0x4200002, 0x4000802, 0, 0x800, 0x4000802, 0x200802, 0x4200800, 0x4200802, 0x200000, 0, 0x4000002, 0x2, 0x4000000, 0x4200002, 0x802, 0x4000800, 0x200802, 0x200002, 0x4000800, 0x4000002, 0x4200000, 0x4200800, 0x200002, 0x4200000, 0x800, 0x802, 0x4200802, 0x200800, 0x2, 0x4000000, 0x200800, 0x4000000, 0x200800, 0x200000, 0x4000802, 0x4000802, 0x4200002, 0x4200002, 0x2, 0x200002, 0x4000000, 0x4000800, 0x200000, 0x4200800, 0x802, 0x200802, 0x4200800, 0x802, 0x4000002, 0x4200802, 0x4200000, 0x200800, 0, 0x2, 0x4200802, 0, 0x200802, 0x4200000, 0x800, 0x4000002, 0x4000800, 0x800, 0x200002);
  let spfunction8 = new Array(0x10001040, 0x1000, 0x40000, 0x10041040, 0x10000000, 0x10001040, 0x40, 0x10000000, 0x40040, 0x10040000, 0x10041040, 0x41000, 0x10041000, 0x41040, 0x1000, 0x40, 0x10040000, 0x10000040, 0x10001000, 0x1040, 0x41000, 0x40040, 0x10040040, 0x10041000, 0x1040, 0, 0, 0x10040040, 0x10000040, 0x10001000, 0x41040, 0x40000, 0x41040, 0x40000, 0x10041000, 0x1000, 0x40, 0x10040040, 0x1000, 0x41040, 0x10001000, 0x40, 0x10000040, 0x10040000, 0x10040040, 0x10000000, 0x40000, 0x10001040, 0, 0x10041040, 0x40040, 0x10000040, 0x10040000, 0x10001000, 0x10001040, 0, 0x10041040, 0x41000, 0x41000, 0x1040, 0x1040, 0x40040, 0x10000000, 0x10041000);
  let keys = desCreateKeys(key);
  let m = 0, i, j, temp, temp2, right1, right2, left, right, looping;
  let cbcleft, cbcleft2, cbcright, cbcright2
  let endloop, loopinc;
  let len = message.length;
  let chunk = 0;
  let iterations = keys.length == 32 ? 3 : 9;
  if (iterations == 3) {
    looping = encrypt ? new Array(0, 32, 2) : new Array(30, -2, -2);
  } else {
    looping = encrypt ? new Array(0, 32, 2, 62, 30, -2, 64, 96, 2) : new Array(94, 62, -2, 32, 64, 2, 30, -2, -2);
  }
  if (padding == 2) message += "        ";
  else if (padding == 1) {
    temp = 8 - (len % 8);
    message += String.fromCharCode(temp, temp, temp, temp, temp, temp, temp, temp);
    if (temp == 8) len += 8;
  } else if (!padding) message += "\0\0\0\0\0\0\0\0";
  result = "";
  tempresult = "";
  if (mode == 1) {
    cbcleft = (iv.charCodeAt(m++) << 24) | (iv.charCodeAt(m++) << 16) | (iv.charCodeAt(m++) << 8) | iv.charCodeAt(m++);
    cbcright = (iv.charCodeAt(m++) << 24) | (iv.charCodeAt(m++) << 16) | (iv.charCodeAt(m++) << 8) | iv.charCodeAt(m++);
    m = 0;
  }
  while (m < len) {
    left = (message.charCodeAt(m++) << 24) | (message.charCodeAt(m++) << 16) | (message.charCodeAt(m++) << 8) | message.charCodeAt(m++);
    right = (message.charCodeAt(m++) << 24) | (message.charCodeAt(m++) << 16) | (message.charCodeAt(m++) << 8) | message.charCodeAt(m++);
    if (mode == 1) {
      if (encrypt) {
        left ^= cbcleft;
        right ^= cbcright;
      } else {
        cbcleft2 = cbcleft;
        cbcright2 = cbcright;
        cbcleft = left;
        cbcright = right;
      }
    }
    temp = ((left >>> 4) ^ right) & 0x0f0f0f0f;
    right ^= temp;
    left ^= (temp << 4);
    temp = ((left >>> 16) ^ right) & 0x0000ffff;
    right ^= temp;
    left ^= (temp << 16);
    temp = ((right >>> 2) ^ left) & 0x33333333;
    left ^= temp;
    right ^= (temp << 2);
    temp = ((right >>> 8) ^ left) & 0x00ff00ff;
    left ^= temp;
    right ^= (temp << 8);
    temp = ((left >>> 1) ^ right) & 0x55555555;
    right ^= temp;
    left ^= (temp << 1);
    left = ((left << 1) | (left >>> 31));
    right = ((right << 1) | (right >>> 31));
    for (j = 0; j < iterations; j += 3) {
      endloop = looping[j + 1];
      loopinc = looping[j + 2];
      for (i = looping[j]; i != endloop; i += loopinc) {
        right1 = right ^ keys[i];
        right2 = ((right >>> 4) | (right << 28)) ^ keys[i + 1];
        temp = left;
        left = right;
        right = temp ^ (spfunction2[(right1 >>> 24) & 0x3f] | spfunction4[(right1 >>> 16) & 0x3f]
          | spfunction6[(right1 >>> 8) & 0x3f] | spfunction8[right1 & 0x3f]
          | spfunction1[(right2 >>> 24) & 0x3f] | spfunction3[(right2 >>> 16) & 0x3f]
          | spfunction5[(right2 >>> 8) & 0x3f] | spfunction7[right2 & 0x3f]);
      }
      temp = left;
      left = right;
      right = temp;
    }
    left = ((left >>> 1) | (left << 31));
    right = ((right >>> 1) | (right << 31));
    temp = ((left >>> 1) ^ right) & 0x55555555;
    right ^= temp;
    left ^= (temp << 1);
    temp = ((right >>> 8) ^ left) & 0x00ff00ff;
    left ^= temp;
    right ^= (temp << 8);
    temp = ((right >>> 2) ^ left) & 0x33333333;
    left ^= temp;
    right ^= (temp << 2);
    temp = ((left >>> 16) ^ right) & 0x0000ffff;
    right ^= temp;
    left ^= (temp << 16);
    temp = ((left >>> 4) ^ right) & 0x0f0f0f0f;
    right ^= temp;
    left ^= (temp << 4);
    if (mode == 1) {
      if (encrypt) {
        cbcleft = left;
        cbcright = right;
      } else {
        left ^= cbcleft2;
        right ^= cbcright2;
      }
    }
    tempresult += String.fromCharCode((left >>> 24), ((left >>> 16) & 0xff), ((left >>> 8) & 0xff), (left & 0xff), (right >>> 24), ((right >>> 16) & 0xff), ((right >>> 8) & 0xff), (right & 0xff));
    chunk += 8;
    if (chunk == 512) {
      result += tempresult;
      tempresult = "";
      chunk = 0;
    }
  }
  result += tempresult;
  result = result.replace(/\0*$/g, "");
  return result;
}

function desCreateKeys(key) {
  pc2bytes0 = new Array(0, 0x4, 0x20000000, 0x20000004, 0x10000, 0x10004, 0x20010000, 0x20010004, 0x200, 0x204, 0x20000200, 0x20000204, 0x10200, 0x10204, 0x20010200, 0x20010204);
  pc2bytes1 = new Array(0, 0x1, 0x100000, 0x100001, 0x4000000, 0x4000001, 0x4100000, 0x4100001, 0x100, 0x101, 0x100100, 0x100101, 0x4000100, 0x4000101, 0x4100100, 0x4100101);
  pc2bytes2 = new Array(0, 0x8, 0x800, 0x808, 0x1000000, 0x1000008, 0x1000800, 0x1000808, 0, 0x8, 0x800, 0x808, 0x1000000, 0x1000008, 0x1000800, 0x1000808);
  pc2bytes3 = new Array(0, 0x200000, 0x8000000, 0x8200000, 0x2000, 0x202000, 0x8002000, 0x8202000, 0x20000, 0x220000, 0x8020000, 0x8220000, 0x22000, 0x222000, 0x8022000, 0x8222000);
  pc2bytes4 = new Array(0, 0x40000, 0x10, 0x40010, 0, 0x40000, 0x10, 0x40010, 0x1000, 0x41000, 0x1010, 0x41010, 0x1000, 0x41000, 0x1010, 0x41010);
  pc2bytes5 = new Array(0, 0x400, 0x20, 0x420, 0, 0x400, 0x20, 0x420, 0x2000000, 0x2000400, 0x2000020, 0x2000420, 0x2000000, 0x2000400, 0x2000020, 0x2000420);
  pc2bytes6 = new Array(0, 0x10000000, 0x80000, 0x10080000, 0x2, 0x10000002, 0x80002, 0x10080002, 0, 0x10000000, 0x80000, 0x10080000, 0x2, 0x10000002, 0x80002, 0x10080002);
  pc2bytes7 = new Array(0, 0x10000, 0x800, 0x10800, 0x20000000, 0x20010000, 0x20000800, 0x20010800, 0x20000, 0x30000, 0x20800, 0x30800, 0x20020000, 0x20030000, 0x20020800, 0x20030800);
  pc2bytes8 = new Array(0, 0x40000, 0, 0x40000, 0x2, 0x40002, 0x2, 0x40002, 0x2000000, 0x2040000, 0x2000000, 0x2040000, 0x2000002, 0x2040002, 0x2000002, 0x2040002);
  pc2bytes9 = new Array(0, 0x10000000, 0x8, 0x10000008, 0, 0x10000000, 0x8, 0x10000008, 0x400, 0x10000400, 0x408, 0x10000408, 0x400, 0x10000400, 0x408, 0x10000408);
  pc2bytes10 = new Array(0, 0x20, 0, 0x20, 0x100000, 0x100020, 0x100000, 0x100020, 0x2000, 0x2020, 0x2000, 0x2020, 0x102000, 0x102020, 0x102000, 0x102020);
  pc2bytes11 = new Array(0, 0x1000000, 0x200, 0x1000200, 0x200000, 0x1200000, 0x200200, 0x1200200, 0x4000000, 0x5000000, 0x4000200, 0x5000200, 0x4200000, 0x5200000, 0x4200200, 0x5200200);
  pc2bytes12 = new Array(0, 0x1000, 0x8000000, 0x8001000, 0x80000, 0x81000, 0x8080000, 0x8081000, 0x10, 0x1010, 0x8000010, 0x8001010, 0x80010, 0x81010, 0x8080010, 0x8081010);
  pc2bytes13 = new Array(0, 0x4, 0x100, 0x104, 0, 0x4, 0x100, 0x104, 0x1, 0x5, 0x101, 0x105, 0x1, 0x5, 0x101, 0x105);
  let iterations = key.length > 8 ? 3 : 1;
  let keys = new Array(32 * iterations);
  let shifts = new Array(0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0);
  let lefttemp, righttemp, m = 0, n = 0, temp;
  for (let j = 0; j < iterations; j++) {
    left = (key.charCodeAt(m++) << 24) | (key.charCodeAt(m++) << 16) | (key.charCodeAt(m++) << 8) | key.charCodeAt(m++);
    right = (key.charCodeAt(m++) << 24) | (key.charCodeAt(m++) << 16) | (key.charCodeAt(m++) << 8) | key.charCodeAt(m++);
    temp = ((left >>> 4) ^ right) & 0x0f0f0f0f;
    right ^= temp;
    left ^= (temp << 4);
    temp = ((right >>> -16) ^ left) & 0x0000ffff;
    left ^= temp;
    right ^= (temp << -16);
    temp = ((left >>> 2) ^ right) & 0x33333333;
    right ^= temp;
    left ^= (temp << 2);
    temp = ((right >>> -16) ^ left) & 0x0000ffff;
    left ^= temp;
    right ^= (temp << -16);
    temp = ((left >>> 1) ^ right) & 0x55555555;
    right ^= temp;
    left ^= (temp << 1);
    temp = ((right >>> 8) ^ left) & 0x00ff00ff;
    left ^= temp;
    right ^= (temp << 8);
    temp = ((left >>> 1) ^ right) & 0x55555555;
    right ^= temp;
    left ^= (temp << 1);
    temp = (left << 8) | ((right >>> 20) & 0x000000f0);
    left = (right << 24) | ((right << 8) & 0xff0000) | ((right >>> 8) & 0xff00) | ((right >>> 24) & 0xf0);
    right = temp;
    for (i = 0; i < shifts.length; i++) {
      if (shifts[i]) {
        left = (left << 2) | (left >>> 26);
        right = (right << 2) | (right >>> 26);
      } else {
        left = (left << 1) | (left >>> 27);
        right = (right << 1) | (right >>> 27);
      }
      left &= -0xf;
      right &= -0xf;
      lefttemp = pc2bytes0[left >>> 28] | pc2bytes1[(left >>> 24) & 0xf]
        | pc2bytes2[(left >>> 20) & 0xf] | pc2bytes3[(left >>> 16) & 0xf]
        | pc2bytes4[(left >>> 12) & 0xf] | pc2bytes5[(left >>> 8) & 0xf]
        | pc2bytes6[(left >>> 4) & 0xf];
      righttemp = pc2bytes7[right >>> 28] | pc2bytes8[(right >>> 24) & 0xf]
        | pc2bytes9[(right >>> 20) & 0xf] | pc2bytes10[(right >>> 16) & 0xf]
        | pc2bytes11[(right >>> 12) & 0xf] | pc2bytes12[(right >>> 8) & 0xf]
        | pc2bytes13[(right >>> 4) & 0xf];
      temp = ((righttemp >>> 16) ^ lefttemp) & 0x0000ffff;
      keys[n++] = lefttemp ^ temp;
      keys[n++] = righttemp ^ (temp << 16);
    }
  }
  return keys;
}

/*
* A JavaScript implementation of the RSA Data Security, Inc. MD4 Message
* Digest Algorithm, as defined in RFC 1320.
* Version 2.1 Copyright (C) Jerrad Pierce, Paul Johnston 1999 - 2002.
* Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
* Distributed under the BSD License
* See http://pajhome.org.uk/crypt/md5 for more info.
*
* Modified by innovaphone
*/

let chrsz = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */
function hexMd4(s) {
  return binl2hex(coreMd4(str2binl(s), s.length * chrsz));
}

function strMd4(s) {
  return binl2str(coreMd4(str2binl(s), s.length * chrsz));
}

function strMd4Ucs2(s) {
  return binl2str(coreMd4(str2binl2(s, 16), s.length * 16));
}

function coreMd4(x, len) {
  x[len >> 5] |= 0x80 << (len % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    let olda = a;
    let oldb = b;
    let oldc = c;
    let oldd = d;
    a = md4Ff(a, b, c, d, x[i + 0], 3);
    d = md4Ff(d, a, b, c, x[i + 1], 7);
    c = md4Ff(c, d, a, b, x[i + 2], 11);
    b = md4Ff(b, c, d, a, x[i + 3], 19);
    a = md4Ff(a, b, c, d, x[i + 4], 3);
    d = md4Ff(d, a, b, c, x[i + 5], 7);
    c = md4Ff(c, d, a, b, x[i + 6], 11);
    b = md4Ff(b, c, d, a, x[i + 7], 19);
    a = md4Ff(a, b, c, d, x[i + 8], 3);
    d = md4Ff(d, a, b, c, x[i + 9], 7);
    c = md4Ff(c, d, a, b, x[i + 10], 11);
    b = md4Ff(b, c, d, a, x[i + 11], 19);
    a = md4Ff(a, b, c, d, x[i + 12], 3);
    d = md4Ff(d, a, b, c, x[i + 13], 7);
    c = md4Ff(c, d, a, b, x[i + 14], 11);
    b = md4Ff(b, c, d, a, x[i + 15], 19);
    a = md4Gg(a, b, c, d, x[i + 0], 3);
    d = md4Gg(d, a, b, c, x[i + 4], 5);
    c = md4Gg(c, d, a, b, x[i + 8], 9);
    b = md4Gg(b, c, d, a, x[i + 12], 13);
    a = md4Gg(a, b, c, d, x[i + 1], 3);
    d = md4Gg(d, a, b, c, x[i + 5], 5);
    c = md4Gg(c, d, a, b, x[i + 9], 9);
    b = md4Gg(b, c, d, a, x[i + 13], 13);
    a = md4Gg(a, b, c, d, x[i + 2], 3);
    d = md4Gg(d, a, b, c, x[i + 6], 5);
    c = md4Gg(c, d, a, b, x[i + 10], 9);
    b = md4Gg(b, c, d, a, x[i + 14], 13);
    a = md4Gg(a, b, c, d, x[i + 3], 3);
    d = md4Gg(d, a, b, c, x[i + 7], 5);
    c = md4Gg(c, d, a, b, x[i + 11], 9);
    b = md4Gg(b, c, d, a, x[i + 15], 13);
    a = md4Hh(a, b, c, d, x[i + 0], 3);
    d = md4Hh(d, a, b, c, x[i + 8], 9);
    c = md4Hh(c, d, a, b, x[i + 4], 11);
    b = md4Hh(b, c, d, a, x[i + 12], 15);
    a = md4Hh(a, b, c, d, x[i + 2], 3);
    d = md4Hh(d, a, b, c, x[i + 10], 9);
    c = md4Hh(c, d, a, b, x[i + 6], 11);
    b = md4Hh(b, c, d, a, x[i + 14], 15);
    a = md4Hh(a, b, c, d, x[i + 1], 3);
    d = md4Hh(d, a, b, c, x[i + 9], 9);
    c = md4Hh(c, d, a, b, x[i + 5], 11);
    b = md4Hh(b, c, d, a, x[i + 13], 15);
    a = md4Hh(a, b, c, d, x[i + 3], 3);
    d = md4Hh(d, a, b, c, x[i + 11], 9);
    c = md4Hh(c, d, a, b, x[i + 7], 11);
    b = md4Hh(b, c, d, a, x[i + 15], 15);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }
  return Array(a, b, c, d);
}

function md4Cmn(q, a, b, x, s, t) {
  return safeAdd(rol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md4Ff(a, b, c, d, x, s) {
  return md4Cmn((b & c) | ((~b) & d), a, 0, x, s, 0);
}

function md4Gg(a, b, c, d, x, s) {
  return md4Cmn((b & c) | (b & d) | (c & d), a, 0, x, s, 1518500249);
}

function md4Hh(a, b, c, d, x, s) {
  return md4Cmn(b ^ c ^ d, a, 0, x, s, 1859775393);
}

function rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

function safeAdd(x, y) {
  let lsw = (x & 0xFFFF) + (y & 0xFFFF);
  let msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

function str2binl(str) {
  let bin = Array();
  let mask = (1 << chrsz) - 1;
  for (let i = 0; i < str.length * chrsz; i += chrsz)
    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
  return bin;
}

function str2binl2(str, clen) {
  let bin = Array();
  let mask = (1 << clen) - 1;
  for (let i = 0; i < str.length * clen; i += clen)
    bin[i >> 5] |= (str.charCodeAt(i / clen) & mask) << (i % 32);
  return bin;
}

function binl2str(bin) {
  let str = "";
  let mask = (1 << chrsz) - 1;
  for (let i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
  return str;
}

function binl2hex(binarray) {
  let hexTab = "0123456789abcdef";
  let str = "";
  for (let i = 0; i < binarray.length * 4; i++) {
    str += hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
      hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
  }
  return str;
}


/*
* A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
* Digest Algorithm, as defined in RFC 1321.
* Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
* Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
* Distributed under the BSD License
* See http://pajhome.org.uk/crypt/md5 for more info.
*/

/*
 * Configurable letiables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
let hexcase = 0;   /* hex output format. 0 - lowercase; 1 - uppercase        */
let b64pad = "";  /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hexMd5(s) {
  return rstr2hex(rstrMd5(str2rstrUtf8(s)));
}

function b64Md5(s) {
  return rstr2b64(rstrMd5(str2rstrUtf8(s)));
}

function anyMd5(s, e) {
  return rstr2any(rstrMd5(str2rstrUtf8(s)), e);
}

function hexHmacMd5(k, d) {
  return rstr2hex(rstrHmacMd5(str2rstrUtf8(k), str2rstrUtf8(d)));
}

function b64HmacMd5(k, d) {
  return rstr2b64(rstrHmacMd5(str2rstrUtf8(k), str2rstrUtf8(d)));
}

function anyHmacMd5(k, d, e) {
  return rstr2any(rstrHmacMd5(str2rstrUtf8(k), str2rstrUtf8(d)), e);
}

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5VmTest() {
  return hexMd5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of a raw string
 */
function rstrMd5(s) {
  return binl2rstr(binlMd5(rstr2binl(s), s.length * 8));
}

/*
 * Calculate the HMAC-MD5, of a key and some data (raw strings)
 */
function rstrHmacMd5(key, data) {
  let bkey = rstr2binl(key);
  if (bkey.length > 16) bkey = binlMd5(bkey, key.length * 8);

  let ipad = Array(16), opad = Array(16);
  for (let i = 0; i < 16; i++) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  let hash = binlMd5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binlMd5(opad.concat(hash), 512 + 128));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input) {
  try {
    hexcase
  } catch (e) {
    hexcase = 0;
  }
  let hexTab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  let output = "";
  let x;
  for (let i = 0; i < input.length; i++) {
    x = input.charCodeAt(i);
    output += hexTab.charAt((x >>> 4) & 0x0F)
      + hexTab.charAt(x & 0x0F);
  }
  return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input) {
  try {
    b64pad
  } catch (e) {
    b64pad = '';
  }
  let tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let output = "";
  let len = input.length;
  for (let i = 0; i < len; i += 3) {
    let triplet = (input.charCodeAt(i) << 16)
      | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
      | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
    for (let j = 0; j < 4; j++) {
      if (i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding) {
  let divisor = encoding.length;
  let i, j, q, x, quotient;

  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  let dividend = Array(Math.ceil(input.length / 2));
  for (i = 0; i < dividend.length; i++) {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }

  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. All remainders are stored for later
   * use.
   */
  let fullLength = Math.ceil(input.length * 8 /
    (Math.log(encoding.length) / Math.log(2)));
  let remainders = Array(fullLength);
  for (j = 0; j < fullLength; j++) {
    quotient = Array();
    x = 0;
    for (i = 0; i < dividend.length; i++) {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if (quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[j] = x;
    dividend = quotient;
  }

  /* Convert the remainders to the output string */
  let output = "";
  for (i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);

  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstrUtf8(input) {
  let output = "";
  let i = -1;
  let x, y;

  while (++i < input.length) {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if (x <= 0x7F)
      output += String.fromCharCode(x);
    else if (x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F),
        0x80 | (x & 0x3F));
    else if (x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
        0x80 | ((x >>> 6) & 0x3F),
        0x80 | (x & 0x3F));
    else if (x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
        0x80 | ((x >>> 12) & 0x3F),
        0x80 | ((x >>> 6) & 0x3F),
        0x80 | (x & 0x3F));
  }
  return output;
}

/*
 * Convert a raw string to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binl(input) {
  let output = Array(input.length >> 2);
  for (let i = 0; i < output.length; i++)
    output[i] = 0;
  for (let i = 0; i < input.length * 8; i += 8)
    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
  return output;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2rstr(input) {
  let output = "";
  for (let i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */
function binlMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    let olda = a;
    let oldb = b;
    let oldc = c;
    let oldd = d;

    a = md5Ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = md5Ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5Ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5Ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5Ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5Ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5Ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5Ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5Ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5Ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5Ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5Ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5Ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5Ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5Ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5Ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = md5Gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5Gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5Gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5Gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = md5Gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5Gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5Gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5Gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5Gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5Gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5Gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5Gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5Gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5Gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5Gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5Gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = md5Hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5Hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5Hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5Hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5Hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5Hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5Hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5Hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5Hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5Hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = md5Hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5Hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5Hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5Hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5Hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5Hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = md5Ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = md5Ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5Ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5Ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5Ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5Ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5Ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5Ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5Ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5Ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5Ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5Ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5Ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5Ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5Ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5Ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }
  return Array(a, b, c, d);
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5Cmn(q, a, b, x, s, t) {
  return safeAdd(bitRol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5Ff(a, b, c, d, x, s, t) {
  return md5Cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function md5Gg(a, b, c, d, x, s, t) {
  return md5Cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function md5Hh(a, b, c, d, x, s, t) {
  return md5Cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5Ii(a, b, c, d, x, s, t) {
  return md5Cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safeAdd(x, y) {
  let lsw = (x & 0xFFFF) + (y & 0xFFFF);
  let msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bitRol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}


/*
 * NTLM hash and session key calculations
 */
function ntlmResponse(password, challenge) {
  function get7Bits(input, startBit) {
    let word = 0;
    word = input.charCodeAt(startBit / 8) << 8;
    word |= input.charCodeAt(startBit / 8 + 1);
    word >>= 15 - (startBit % 8 + 7);
    return String.fromCharCode(word & 0xfe);
  }

  function makeKey(input) {
    return get7Bits(input, 0) +
      get7Bits(input, 7) +
      get7Bits(input, 14) +
      get7Bits(input, 21) +
      get7Bits(input, 28) +
      get7Bits(input, 35) +
      get7Bits(input, 42) +
      get7Bits(input, 49);
  }

  challenge = hex2str(challenge);
  let ntKey = strMd4Ucs2(password);
  let key1 = makeKey(ntKey.substr(0, 7));
  let key2 = makeKey(ntKey.substr(7, 7));
  let key3 = makeKey(ntKey.substr(14, 2) + "\0\0\0\0\0");
  return str2hex(des(key1, challenge, true) + des(key2, challenge, true) + des(key3, challenge, true));
}

function ntlmSessionKey(password) {
  return hexMd4(strMd4Ucs2(password));
}

function scramble(name, value) {
  return str2hex(rc4(name, value));
}

function descramble(name, value) {
  return rc4(name, hex2str(value));
}

function randomString(length) {
  let characters = "0123456789abcdefghijklmnopqrstuvwABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) result += characters.charAt(Math.round(Math.random() * (characters.length - 1)));
  return result;
}

function rc4Bytes(keyBytes, strBytes) {
  let s = [], j = 0, x, res = '';
  for (let i = 0; i < 256; i++) {
    s[i] = i;
  }
  for (i = 0; i < 256; i++) {
    j = (j + s[i] + keyBytes[i % keyBytes.length]) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
  }
  i = 0;
  j = 0;
  for (let y = 0; y < strBytes.length; y++) {
    i = (i + 1) % 256;
    j = (j + s[i]) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
    res += String.fromCharCode(strBytes[y] ^ s[(s[i] + s[j]) % 256]);
  }
  return res;
}

function hex2bin(input) {
  let hex = input.toString();
  let arr = [];
  for (let i = 0; i < hex.length; i += 2) {
    arr.push(parseInt(hex.substr(i, 2), 16));
  }
  return arr;
}

function textEncode(str) {
  if (window.TextEncoder) {
    return new TextEncoder('utf-8').encode(str);
  }
  let utf8 = unescape(encodeURIComponent(str));
  let result = new Uint8Array(utf8.length);
  for (let i = 0; i < utf8.length; i++) {
    result[i] = utf8.charCodeAt(i);
  }
  return result;
}

function byteArrayToString(arr) {
  // input: utf-8-encoded byte array
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    let c = arr.charCodeAt(i);
    if ((c & 0x80) == 0x00) {
      // one-byte character [0xxxxxxx] (code points 0-7F)
      let codePoint = (c & 0x7F);
      str += String.fromCodePoint(codePoint);
    } else if ((c & 0xe0) == 0xc0) {
      // two-byte character [110xxxxx 10xxxxxx] (code points 80-7FF)
      let codePoint = (c & 0x1F) << 6;
      codePoint |= (arr.charCodeAt(++i) & 0x3F);
      str += String.fromCodePoint(codePoint);
    } else if ((c & 0xf0) == 0xe0) {
      // three-byte character [1110xxxx 10xxxxxx 10xxxxxx] (code points 800-FFFF)
      let codePoint = (c & 0x0F) << 12;
      codePoint |= (arr.charCodeAt(++i) & 0x3F) << 6;
      codePoint |= (arr.charCodeAt(++i) & 0x3F);
      str += String.fromCodePoint(codePoint);
    } else if ((c & 0xf8) == 0xf0) {
      // four-byte character [11110xxx 10xxxxxx 10xxxxxx 10xxxxxx] (code points 10000-1FFFFF)
      let codePoint = (c & 0x07) << 18;
      codePoint |= (arr.charCodeAt(++i) & 0x3F) << 12;
      codePoint |= (arr.charCodeAt(++i) & 0x3F) << 6;
      codePoint |= (arr.charCodeAt(++i) & 0x3F);
      str += String.fromCodePoint(codePoint);
    }
  }
  return str;
}

var CountryCodes = [1, 20, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 27, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 30, 31, 32, 33, 34, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 36, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 39, 40, 41, 420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 43, 44, 45, 46, 47, 48, 49, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 51, 52, 53, 54, 55, 56, 57, 58, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 599, 60, 61, 62, 63, 64, 65, 66, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 696, 697, 698, 699, 7, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 81, 82, 830, 831, 832, 833, 834, 835, 836, 837, 838, 839, 84, 850, 851, 852, 853, 854, 855, 856, 857, 858, 859, 86, 870, 871, 872, 873, 874, 875, 876, 877, 878, 879, 880, 881, 882, 883, 884, 885, 886, 887, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 899, 90, 91, 92, 93, 94, 95, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 970, 971, 972, 973, 974, 975, 976, 977, 978, 979, 98, 990, 991, 992, 993, 994, 995, 996, 997, 998, 999];
var ccEntryPoints = [null, null, null, null, null, null, null, null, null, null]; // CountryCodes starting with 0,1,2,3,...
for (var i = 0; i < CountryCodes.length; i++) {
  var CountryCode = CountryCodes[i].toString();
  var FirstDigit = Number(CountryCode[0]);
  if (ccEntryPoints[FirstDigit] == null) ccEntryPoints[FirstDigit] = i;
}
if (!Array.prototype.remove) {
  Array.prototype.remove = function (element) {
    // returns the element or null
    var index = this.indexOf(element);
    return (index >= 0) ? this.splice(index, 1)[0] : null;
  };
}
Object.defineProperty(Array.prototype, "remove", {enumerable: false}); // Hide method from for-in loops

CheckCountryCode = function (num) {
  // returns length of country code or zero if no country code matches
  if (num.charAt(0) == '+' || num.charAt(0) == 'I') {
    num = num.substr(1);
  }
  var FirstDigit = Number(num.charAt(0));
  var EntryPoint = ccEntryPoints[FirstDigit];
  if (EntryPoint) {
    for (var i = EntryPoint; i < CountryCodes.length; i++) {
      var cc = CountryCodes[i].toString();
      if (num.startsWith(cc)) return cc.length;
    }
  }
  return 0;
}

var DE = {
  // https://www.bundesnetzagentur.de/DE/Sachgebiete/Telekommunikation/Unternehmen_Institutionen/Nummerierung/Rufnummern/ONRufnr/ON_Einteilung_ONB/ON_ONB_ONKz_ONBGrenzen_Basepage.html
  // https://www.bundesnetzagentur.de/DE/Sachgebiete/Telekommunikation/Unternehmen_Institutionen/Nummerierung/Rufnummern/Rufnummern_node.html
  Sonderdienste: [1801, 1802, 1803, 1804, 1805, 700, 800, 900],
  Ortsnetzkennzahlen: [201, 202, 203, 2041, 2043, 2045, 2051, 2052, 2053, 2054, 2056, 2058, 2064, 2065, 2066, 208, 209, 2102, 2103, 2104, 211, 212, 2129, 2131, 2132, 2133, 2137, 214, 2150, 2151, 2152, 2153, 2154, 2156, 2157, 2158, 2159, 2161, 2162, 2163, 2164, 2165, 2166, 2171, 2173, 2174, 2175, 2181, 2182, 2183, 2191, 2192, 2193, 2195, 2196, 2202, 2203, 2204, 2205, 2206, 2207, 2208, 221, 2222, 2223, 2224, 2225, 2226, 2227, 2228, 2232, 2233, 2234, 2235, 2236, 2237, 2238, 2241, 2242, 2243, 2244, 2245, 2246, 2247, 2248, 2251, 2252, 2253, 2254, 2255, 2256, 2257, 2261, 2262, 2263, 2264, 2265, 2266, 2267, 2268, 2269, 2271, 2272, 2273, 2274, 2275, 228, 2291, 2292, 2293, 2294, 2295, 2296, 2297, 2301, 2302, 2303, 2304, 2305, 2306, 2307, 2308, 2309, 231, 2323, 2324, 2325, 2327, 2330, 2331, 2332, 2333, 2334, 2335, 2336, 2337, 2338, 2339, 234, 2351, 2352, 2353, 2354, 2355, 2357, 2358, 2359, 2360, 2361, 2362, 2363, 2364, 2365, 2366, 2367, 2368, 2369, 2371, 2372, 2373, 2374, 2375, 2377, 2378, 2379, 2381, 2382, 2383, 2384, 2385, 2387, 2388, 2389, 2391, 2392, 2393, 2394, 2395, 2401, 2402, 2403, 2404, 2405, 2406, 2407, 2408, 2409, 241, 2421, 2422, 2423, 2424, 2425, 2426, 2427, 2428, 2429, 2431, 2432, 2433, 2434, 2435, 2436, 2440, 2441, 2443, 2444, 2445, 2446, 2447, 2448, 2449, 2451, 2452, 2453, 2454, 2455, 2456, 2461, 2462, 2463, 2464, 2465, 2471, 2472, 2473, 2474, 2482, 2484, 2485, 2486, 2501, 2502, 2504, 2505, 2506, 2507, 2508, 2509, 251, 2520, 2521, 2522, 2523, 2524, 2525, 2526, 2527, 2528, 2529, 2532, 2533, 2534, 2535, 2536, 2538, 2541, 2542, 2543, 2545, 2546, 2547, 2548, 2551, 2552, 2553, 2554, 2555, 2556, 2557, 2558, 2561, 2562, 2563, 2564, 2565, 2566, 2567, 2568, 2571, 2572, 2573, 2574, 2575, 2581, 2582, 2583, 2584, 2585, 2586, 2587, 2588, 2590, 2591, 2592, 2593, 2594, 2595, 2596, 2597, 2598, 2599, 2601, 2602, 2603, 2604, 2605, 2606, 2607, 2608, 261, 2620, 2621, 2622, 2623, 2624, 2625, 2626, 2627, 2628, 2630, 2631, 2632, 2633, 2634, 2635, 2636, 2637, 2638, 2639, 2641, 2642, 2643, 2644, 2645, 2646, 2647, 2651, 2652, 2653, 2654, 2655, 2656, 2657, 2661, 2662, 2663, 2664, 2666, 2667, 2671, 2672, 2673, 2674, 2675, 2676, 2677, 2678, 2680, 2681, 2682, 2683, 2684, 2685, 2686, 2687, 2688, 2689, 2691, 2692, 2693, 2694, 2695, 2696, 2697, 271, 2721, 2722, 2723, 2724, 2725, 2732, 2733, 2734, 2735, 2736, 2737, 2738, 2739, 2741, 2742, 2743, 2744, 2745, 2747, 2750, 2751, 2752, 2753, 2754, 2755, 2758, 2759, 2761, 2762, 2763, 2764, 2770, 2771, 2772, 2773, 2774, 2775, 2776, 2777, 2778, 2779, 2801, 2802, 2803, 2804, 281, 2821, 2822, 2823, 2824, 2825, 2826, 2827, 2828, 2831, 2832, 2833, 2834, 2835, 2836, 2837, 2838, 2839, 2841, 2842, 2843, 2844, 2845, 2850, 2851, 2852, 2853, 2855, 2856, 2857, 2858, 2859, 2861, 2862, 2863, 2864, 2865, 2866, 2867, 2871, 2872, 2873, 2874, 2902, 2903, 2904, 2905, 291, 2921, 2922, 2923, 2924, 2925, 2927, 2928, 2931, 2932, 2933, 2934, 2935, 2937, 2938, 2941, 2942, 2943, 2944, 2945, 2947, 2948, 2951, 2952, 2953, 2954, 2955, 2957, 2958, 2961, 2962, 2963, 2964, 2971, 2972, 2973, 2974, 2975, 2977, 2981, 2982, 2983, 2984, 2985, 2991, 2992, 2993, 2994, 30, 3301, 3302, 3303, 3304, 33051, 33052, 33053, 33054, 33055, 33056, 3306, 3307, 33080, 33082, 33083, 33084, 33085, 33086, 33087, 33088, 33089, 33093, 33094, 331, 33200, 33201, 33202, 33203, 33204, 33205, 33206, 33207, 33208, 33209, 3321, 3322, 33230, 33231, 33232, 33233, 33234, 33235, 33237, 33238, 33239, 3327, 3328, 3329, 3331, 3332, 33331, 33332, 33333, 33334, 33335, 33336, 33337, 33338, 3334, 3335, 33361, 33362, 33363, 33364, 33365, 33366, 33367, 33368, 33369, 3337, 3338, 33393, 33394, 33395, 33396, 33397, 33398, 3341, 3342, 33432, 33433, 33434, 33435, 33436, 33437, 33438, 33439, 3344, 33451, 33452, 33454, 33456, 33457, 33458, 3346, 33470, 33472, 33473, 33474, 33475, 33476, 33477, 33478, 33479, 335, 33601, 33602, 33603, 33604, 33605, 33606, 33607, 33608, 33609, 3361, 3362, 33631, 33632, 33633, 33634, 33635, 33636, 33637, 33638, 3364, 33652, 33653, 33654, 33655, 33656, 33657, 3366, 33671, 33672, 33673, 33674, 33675, 33676, 33677, 33678, 33679, 33701, 33702, 33703, 33704, 33708, 3371, 3372, 33731, 33732, 33733, 33734, 33741, 33742, 33743, 33744, 33745, 33746, 33747, 33748, 3375, 33760, 33762, 33763, 33764, 33765, 33766, 33767, 33768, 33769, 3377, 3378, 3379, 3381, 3382, 33830, 33831, 33832, 33833, 33834, 33835, 33836, 33837, 33838, 33839, 33841, 33843, 33844, 33845, 33846, 33847, 33848, 33849, 3385, 3386, 33870, 33872, 33873, 33874, 33875, 33876, 33877, 33878, 3391, 33920, 33921, 33922, 33923, 33924, 33925, 33926, 33927, 33928, 33929, 33931, 33932, 33933, 3394, 3395, 33962, 33963, 33964, 33965, 33966, 33967, 33968, 33969, 33970, 33971, 33972, 33973, 33974, 33975, 33976, 33977, 33978, 33979, 33981, 33982, 33983, 33984, 33986, 33989, 340, 341, 34202, 34203, 34204, 34205, 34206, 34207, 34208, 3421, 34221, 34222, 34223, 34224, 3423, 34241, 34242, 34243, 34244, 3425, 34261, 34262, 34263, 34291, 34292, 34293, 34294, 34295, 34296, 34297, 34298, 34299, 3431, 34321, 34322, 34324, 34325, 34327, 34328, 3433, 34341, 34342, 34343, 34344, 34345, 34346, 34347, 34348, 3435, 34361, 34362, 34363, 34364, 3437, 34381, 34382, 34383, 34384, 34385, 34386, 3441, 34422, 34423, 34424, 34425, 34426, 3443, 34441, 34443, 34444, 34445, 34446, 3445, 34461, 34462, 34463, 34464, 34465, 34466, 34467, 3447, 3448, 34491, 34492, 34493, 34494, 34495, 34496, 34497, 34498, 345, 34600, 34601, 34602, 34603, 34604, 34605, 34606, 34607, 34609, 3461, 3462, 34632, 34633, 34635, 34636, 34637, 34638, 34639, 3464, 34651, 34652, 34653, 34654, 34656, 34658, 34659, 3466, 34671, 34672, 34673, 34691, 34692, 3471, 34721, 34722, 3473, 34741, 34742, 34743, 34745, 34746, 3475, 3476, 34771, 34772, 34773, 34774, 34775, 34776, 34779, 34781, 34782, 34783, 34785, 34901, 34903, 34904, 34905, 34906, 34907, 34909, 3491, 34920, 34921, 34922, 34923, 34924, 34925, 34926, 34927, 34928, 34929, 3493, 3494, 34953, 34954, 34955, 34956, 3496, 34973, 34975, 34976, 34977, 34978, 34979, 3501, 35020, 35021, 35022, 35023, 35024, 35025, 35026, 35027, 35028, 35032, 35033, 3504, 35052, 35053, 35054, 35055, 35056, 35057, 35058, 351, 35200, 35201, 35202, 35203, 35204, 35205, 35206, 35207, 35208, 35209, 3521, 3522, 3523, 35240, 35241, 35242, 35243, 35244, 35245, 35246, 35247, 35248, 35249, 3525, 35263, 35264, 35265, 35266, 35267, 35268, 3528, 3529, 3531, 35322, 35323, 35324, 35325, 35326, 35327, 35329, 3533, 35341, 35342, 35343, 3535, 35361, 35362, 35363, 35364, 35365, 3537, 35383, 35384, 35385, 35386, 35387, 35388, 35389, 3541, 3542, 35433, 35434, 35435, 35436, 35439, 3544, 35451, 35452, 35453, 35454, 35455, 35456, 3546, 35471, 35472, 35473, 35474, 35475, 35476, 35477, 35478, 355, 35600, 35601, 35602, 35603, 35604, 35605, 35606, 35607, 35608, 35609, 3561, 3562, 3563, 3564, 35691, 35692, 35693, 35694, 35695, 35696, 35697, 35698, 3571, 35722, 35723, 35724, 35725, 35726, 35727, 35728, 3573, 3574, 35751, 35752, 35753, 35754, 35755, 35756, 3576, 35771, 35772, 35773, 35774, 35775, 3578, 35792, 35793, 35795, 35796, 35797, 3581, 35820, 35822, 35823, 35825, 35826, 35827, 35828, 35829, 3583, 35841, 35842, 35843, 35844, 3585, 3586, 35872, 35873, 35874, 35875, 35876, 35877, 3588, 35891, 35892, 35893, 35894, 35895, 3591, 3592, 35930, 35931, 35932, 35933, 35934, 35935, 35936, 35937, 35938, 35939, 3594, 35951, 35952, 35953, 35954, 35955, 3596, 35971, 35973, 35974, 35975, 3601, 36020, 36021, 36022, 36023, 36024, 36025, 36026, 36027, 36028, 36029, 3603, 36041, 36042, 36043, 3605, 3606, 36071, 36072, 36074, 36075, 36076, 36077, 36081, 36082, 36083, 36084, 36085, 36087, 361, 36200, 36201, 36202, 36203, 36204, 36205, 36206, 36207, 36208, 36209, 3621, 3622, 3623, 3624, 36252, 36253, 36254, 36255, 36256, 36257, 36258, 36259, 3628, 3629, 3631, 3632, 36330, 36331, 36332, 36333, 36334, 36335, 36336, 36337, 36338, 3634, 3635, 3636, 36370, 36371, 36372, 36373, 36374, 36375, 36376, 36377, 36378, 36379, 3641, 36421, 36422, 36423, 36424, 36425, 36426, 36427, 36428, 3643, 3644, 36450, 36451, 36452, 36453, 36454, 36458, 36459, 36461, 36462, 36463, 36464, 36465, 3647, 36481, 36482, 36483, 36484, 365, 36601, 36602, 36603, 36604, 36605, 36606, 36607, 36608, 3661, 36621, 36622, 36623, 36624, 36625, 36626, 36628, 3663, 36640, 36642, 36643, 36644, 36645, 36646, 36647, 36648, 36649, 36651, 36652, 36653, 36691, 36692, 36693, 36694, 36695, 36701, 36702, 36703, 36704, 36705, 3671, 3672, 36730, 36731, 36732, 36733, 36734, 36735, 36736, 36737, 36738, 36739, 36741, 36742, 36743, 36744, 3675, 36761, 36762, 36764, 36766, 3677, 36781, 36782, 36783, 36784, 36785, 3679, 3681, 3682, 3683, 36840, 36841, 36842, 36843, 36844, 36845, 36846, 36847, 36848, 36849, 3685, 3686, 36870, 36871, 36873, 36874, 36875, 36878, 3691, 36920, 36921, 36922, 36923, 36924, 36925, 36926, 36927, 36928, 36929, 3693, 36940, 36941, 36943, 36944, 36945, 36946, 36947, 36948, 36949, 3695, 36961, 36962, 36963, 36964, 36965, 36966, 36967, 36968, 36969, 371, 37200, 37202, 37203, 37204, 37206, 37207, 37208, 37209, 3721, 3722, 3723, 3724, 3725, 3726, 3727, 37291, 37292, 37293, 37294, 37295, 37296, 37297, 37298, 3731, 37320, 37321, 37322, 37323, 37324, 37325, 37326, 37327, 37328, 37329, 3733, 37341, 37342, 37343, 37344, 37346, 37347, 37348, 37349, 3735, 37360, 37361, 37362, 37363, 37364, 37365, 37366, 37367, 37368, 37369, 3737, 37381, 37382, 37383, 37384, 3741, 37421, 37422, 37423, 37430, 37431, 37432, 37433, 37434, 37435, 37436, 37437, 37438, 37439, 3744, 3745, 37462, 37463, 37464, 37465, 37467, 37468, 375, 37600, 37601, 37602, 37603, 37604, 37605, 37606, 37607, 37608, 37609, 3761, 3762, 3763, 3764, 3765, 3771, 3772, 3773, 3774, 37752, 37754, 37755, 37756, 37757, 381, 38201, 38202, 38203, 38204, 38205, 38206, 38207, 38208, 38209, 3821, 38220, 38221, 38222, 38223, 38224, 38225, 38226, 38227, 38228, 38229, 38231, 38232, 38233, 38234, 38292, 38293, 38294, 38295, 38296, 38297, 38300, 38301, 38302, 38303, 38304, 38305, 38306, 38307, 38308, 38309, 3831, 38320, 38321, 38322, 38323, 38324, 38325, 38326, 38327, 38328, 38331, 38332, 38333, 38334, 3834, 38351, 38352, 38353, 38354, 38355, 38356, 3836, 38370, 38371, 38372, 38373, 38374, 38375, 38376, 38377, 38378, 38379, 3838, 38391, 38392, 38393, 3841, 38422, 38423, 38424, 38425, 38426, 38427, 38428, 38429, 3843, 3844, 38450, 38451, 38452, 38453, 38454, 38455, 38456, 38457, 38458, 38459, 38461, 38462, 38464, 38466, 3847, 38481, 38482, 38483, 38484, 38485, 38486, 38488, 385, 3860, 3861, 3863, 3865, 3866, 3867, 3868, 3869, 3871, 38720, 38721, 38722, 38723, 38724, 38725, 38726, 38727, 38728, 38729, 38731, 38732, 38733, 38735, 38736, 38737, 38738, 3874, 38750, 38751, 38752, 38753, 38754, 38755, 38756, 38757, 38758, 38759, 3876, 3877, 38780, 38781, 38782, 38783, 38784, 38785, 38787, 38788, 38789, 38791, 38792, 38793, 38794, 38796, 38797, 3881, 38821, 38822, 38823, 38824, 38825, 38826, 38827, 38828, 3883, 38841, 38842, 38843, 38844, 38845, 38847, 38848, 38850, 38851, 38852, 38853, 38854, 38855, 38856, 38858, 38859, 3886, 38871, 38872, 38873, 38874, 38875, 38876, 39000, 39001, 39002, 39003, 39004, 39005, 39006, 39007, 39008, 39009, 3901, 3902, 39030, 39031, 39032, 39033, 39034, 39035, 39036, 39037, 39038, 39039, 3904, 39050, 39051, 39052, 39053, 39054, 39055, 39056, 39057, 39058, 39059, 39061, 39062, 3907, 39080, 39081, 39082, 39083, 39084, 39085, 39086, 39087, 39088, 39089, 3909, 391, 39200, 39201, 39202, 39203, 39204, 39205, 39206, 39207, 39208, 39209, 3921, 39221, 39222, 39223, 39224, 39225, 39226, 3923, 39241, 39242, 39243, 39244, 39245, 39246, 39247, 39248, 3925, 39262, 39263, 39264, 39265, 39266, 39267, 39268, 3928, 39291, 39292, 39293, 39294, 39295, 39296, 39297, 39298, 3931, 39320, 39321, 39322, 39323, 39324, 39325, 39327, 39328, 39329, 3933, 39341, 39342, 39343, 39344, 39345, 39346, 39347, 39348, 39349, 3935, 39361, 39362, 39363, 39364, 39365, 39366, 3937, 39382, 39383, 39384, 39386, 39387, 39388, 39389, 39390, 39391, 39392, 39393, 39394, 39395, 39396, 39397, 39398, 39399, 39400, 39401, 39402, 39403, 39404, 39405, 39406, 39407, 39408, 39409, 3941, 39421, 39422, 39423, 39424, 39425, 39426, 39427, 39428, 3943, 3944, 39451, 39452, 39453, 39454, 39455, 39456, 39457, 39458, 39459, 3946, 3947, 39481, 39482, 39483, 39484, 39485, 39487, 39488, 39489, 3949, 395, 39600, 39601, 39602, 39603, 39604, 39605, 39606, 39607, 39608, 3961, 3962, 3963, 3964, 3965, 3966, 3967, 3968, 3969, 3971, 39721, 39722, 39723, 39724, 39726, 39727, 39728, 3973, 39740, 39741, 39742, 39743, 39744, 39745, 39746, 39747, 39748, 39749, 39751, 39752, 39753, 39754, 3976, 39771, 39772, 39773, 39774, 39775, 39776, 39777, 39778, 39779, 3981, 39820, 39821, 39822, 39823, 39824, 39825, 39826, 39827, 39828, 39829, 39831, 39832, 39833, 3984, 39851, 39852, 39853, 39854, 39855, 39856, 39857, 39858, 39859, 39861, 39862, 39863, 3987, 39881, 39882, 39883, 39884, 39885, 39886, 39887, 39888, 39889, 3991, 39921, 39922, 39923, 39924, 39925, 39926, 39927, 39928, 39929, 39931, 39932, 39933, 39934, 3994, 39951, 39952, 39953, 39954, 39955, 39956, 39957, 39959, 3996, 39971, 39972, 39973, 39975, 39976, 39977, 39978, 3998, 39991, 39992, 39993, 39994, 39995, 39996, 39997, 39998, 39999, 40, 4101, 4102, 4103, 4104, 4105, 4106, 4107, 4108, 4109, 4120, 4121, 4122, 4123, 4124, 4125, 4126, 4127, 4128, 4129, 4131, 4132, 4133, 4134, 4135, 4136, 4137, 4138, 4139, 4140, 4141, 4142, 4143, 4144, 4146, 4148, 4149, 4151, 4152, 4153, 4154, 4155, 4156, 4158, 4159, 4161, 4162, 4163, 4164, 4165, 4166, 4167, 4168, 4169, 4171, 4172, 4173, 4174, 4175, 4176, 4177, 4178, 4179, 4180, 4181, 4182, 4183, 4184, 4185, 4186, 4187, 4188, 4189, 4191, 4192, 4193, 4194, 4195, 4202, 4203, 4204, 4205, 4206, 4207, 4208, 4209, 421, 4221, 4222, 4223, 4224, 4230, 4231, 4232, 4233, 4234, 4235, 4236, 4237, 4238, 4239, 4240, 4241, 4242, 4243, 4244, 4245, 4246, 4247, 4248, 4249, 4251, 4252, 4253, 4254, 4255, 4256, 4257, 4258, 4260, 4261, 4262, 4263, 4264, 4265, 4266, 4267, 4268, 4269, 4271, 4272, 4273, 4274, 4275, 4276, 4277, 4281, 4282, 4283, 4284, 4285, 4286, 4287, 4288, 4289, 4292, 4293, 4294, 4295, 4296, 4297, 4298, 4302, 4303, 4305, 4307, 4308, 431, 4320, 4321, 4322, 4323, 4324, 4326, 4327, 4328, 4329, 4330, 4331, 4332, 4333, 4334, 4335, 4336, 4337, 4338, 4339, 4340, 4342, 4343, 4344, 4346, 4347, 4348, 4349, 4351, 4352, 4353, 4354, 4355, 4356, 4357, 4358, 4361, 4362, 4363, 4364, 4365, 4366, 4367, 4371, 4372, 4381, 4382, 4383, 4384, 4385, 4392, 4393, 4394, 4401, 4402, 4403, 4404, 4405, 4406, 4407, 4408, 4409, 441, 4421, 4422, 4423, 4425, 4426, 4431, 4432, 4433, 4434, 4435, 4441, 4442, 4443, 4444, 4445, 4446, 4447, 4451, 4452, 4453, 4454, 4455, 4456, 4458, 4461, 4462, 4463, 4464, 4465, 4466, 4467, 4468, 4469, 4471, 4472, 4473, 4474, 4475, 4477, 4478, 4479, 4480, 4481, 4482, 4483, 4484, 4485, 4486, 4487, 4488, 4489, 4491, 4492, 4493, 4494, 4495, 4496, 4497, 4498, 4499, 4501, 4502, 4503, 4504, 4505, 4506, 4508, 4509, 451, 4521, 4522, 4523, 4524, 4525, 4526, 4527, 4528, 4529, 4531, 4532, 4533, 4534, 4535, 4536, 4537, 4539, 4541, 4542, 4543, 4544, 4545, 4546, 4547, 4550, 4551, 4552, 4553, 4554, 4555, 4556, 4557, 4558, 4559, 4561, 4562, 4563, 4564, 4602, 4603, 4604, 4605, 4606, 4607, 4608, 4609, 461, 4621, 4622, 4623, 4624, 4625, 4626, 4627, 4630, 4631, 4632, 4633, 4634, 4635, 4636, 4637, 4638, 4639, 4641, 4642, 4643, 4644, 4646, 4651, 4661, 4662, 4663, 4664, 4665, 4666, 4667, 4668, 4671, 4672, 4673, 4674, 4681, 4682, 4683, 4684, 4702, 4703, 4704, 4705, 4706, 4707, 4708, 471, 4721, 4722, 4723, 4724, 4725, 4731, 4732, 4733, 4734, 4735, 4736, 4737, 4740, 4741, 4742, 4743, 4744, 4745, 4746, 4747, 4748, 4749, 4751, 4752, 4753, 4754, 4755, 4756, 4757, 4758, 4761, 4762, 4763, 4764, 4765, 4766, 4767, 4768, 4769, 4770, 4771, 4772, 4773, 4774, 4775, 4776, 4777, 4778, 4779, 4791, 4792, 4793, 4794, 4795, 4796, 4802, 4803, 4804, 4805, 4806, 481, 4821, 4822, 4823, 4824, 4825, 4826, 4827, 4828, 4829, 4830, 4832, 4833, 4834, 4835, 4836, 4837, 4838, 4839, 4841, 4842, 4843, 4844, 4845, 4846, 4847, 4848, 4849, 4851, 4852, 4853, 4854, 4855, 4856, 4857, 4858, 4859, 4861, 4862, 4863, 4864, 4865, 4871, 4872, 4873, 4874, 4875, 4876, 4877, 4881, 4882, 4883, 4884, 4885, 4892, 4893, 4902, 4903, 491, 4920, 4921, 4922, 4923, 4924, 4925, 4926, 4927, 4928, 4929, 4931, 4932, 4933, 4934, 4935, 4936, 4938, 4939, 4941, 4942, 4943, 4944, 4945, 4946, 4947, 4948, 4950, 4951, 4952, 4953, 4954, 4955, 4956, 4957, 4958, 4959, 4961, 4962, 4963, 4964, 4965, 4966, 4967, 4968, 4971, 4972, 4973, 4974, 4975, 4976, 4977, 5021, 5022, 5023, 5024, 5025, 5026, 5027, 5028, 5031, 5032, 5033, 5034, 5035, 5036, 5037, 5041, 5042, 5043, 5044, 5045, 5051, 5052, 5053, 5054, 5055, 5056, 5060, 5062, 5063, 5064, 5065, 5066, 5067, 5068, 5069, 5071, 5072, 5073, 5074, 5082, 5083, 5084, 5085, 5086, 5101, 5102, 5103, 5105, 5108, 5109, 511, 5121, 5123, 5126, 5127, 5128, 5129, 5130, 5131, 5132, 5135, 5136, 5137, 5138, 5139, 5141, 5142, 5143, 5144, 5145, 5146, 5147, 5148, 5149, 5151, 5152, 5153, 5154, 5155, 5156, 5157, 5158, 5159, 5161, 5162, 5163, 5164, 5165, 5166, 5167, 5168, 5171, 5172, 5173, 5174, 5175, 5176, 5177, 5181, 5182, 5183, 5184, 5185, 5186, 5187, 5190, 5191, 5192, 5193, 5194, 5195, 5196, 5197, 5198, 5199, 5201, 5202, 5203, 5204, 5205, 5206, 5207, 5208, 5209, 521, 5221, 5222, 5223, 5224, 5225, 5226, 5228, 5231, 5232, 5233, 5234, 5235, 5236, 5237, 5238, 5241, 5242, 5244, 5245, 5246, 5247, 5248, 5250, 5251, 5252, 5253, 5254, 5255, 5257, 5258, 5259, 5261, 5262, 5263, 5264, 5265, 5266, 5271, 5272, 5273, 5274, 5275, 5276, 5277, 5278, 5281, 5282, 5283, 5284, 5285, 5286, 5292, 5293, 5294, 5295, 5300, 5301, 5302, 5303, 5304, 5305, 5306, 5307, 5308, 5309, 531, 5320, 5321, 5322, 5323, 5324, 5325, 5326, 5327, 5328, 5329, 5331, 5332, 5333, 5334, 5335, 5336, 5337, 5339, 5341, 5344, 5345, 5346, 5347, 5351, 5352, 5353, 5354, 5355, 5356, 5357, 5358, 5361, 5362, 5363, 5364, 5365, 5366, 5367, 5368, 5371, 5372, 5373, 5374, 5375, 5376, 5377, 5378, 5379, 5381, 5382, 5383, 5384, 5401, 5402, 5403, 5404, 5405, 5406, 5407, 5409, 541, 5421, 5422, 5423, 5424, 5425, 5426, 5427, 5428, 5429, 5431, 5432, 5433, 5434, 5435, 5436, 5437, 5438, 5439, 5441, 5442, 5443, 5444, 5445, 5446, 5447, 5448, 5451, 5452, 5453, 5454, 5455, 5456, 5457, 5458, 5459, 5461, 5462, 5464, 5465, 5466, 5467, 5468, 5471, 5472, 5473, 5474, 5475, 5476, 5481, 5482, 5483, 5484, 5485, 5491, 5492, 5493, 5494, 5495, 5502, 5503, 5504, 5505, 5506, 5507, 5508, 5509, 551, 5520, 5521, 5522, 5523, 5524, 5525, 5527, 5528, 5529, 5531, 5532, 5533, 5534, 5535, 5536, 5541, 5542, 5543, 5544, 5545, 5546, 5551, 5552, 5553, 5554, 5555, 5556, 5561, 5562, 5563, 5564, 5565, 5571, 5572, 5573, 5574, 5582, 5583, 5584, 5585, 5586, 5592, 5593, 5594, 5601, 5602, 5603, 5604, 5605, 5606, 5607, 5608, 5609, 561, 5621, 5622, 5623, 5624, 5625, 5626, 5631, 5632, 5633, 5634, 5635, 5636, 5641, 5642, 5643, 5644, 5645, 5646, 5647, 5648, 5650, 5651, 5652, 5653, 5654, 5655, 5656, 5657, 5658, 5659, 5661, 5662, 5663, 5664, 5665, 5671, 5672, 5673, 5674, 5675, 5676, 5677, 5681, 5682, 5683, 5684, 5685, 5686, 5691, 5692, 5693, 5694, 5695, 5696, 5702, 5703, 5704, 5705, 5706, 5707, 571, 5721, 5722, 5723, 5724, 5725, 5726, 5731, 5732, 5733, 5734, 5741, 5742, 5743, 5744, 5745, 5746, 5751, 5752, 5753, 5754, 5755, 5761, 5763, 5764, 5765, 5766, 5767, 5768, 5769, 5771, 5772, 5773, 5774, 5775, 5776, 5777, 5802, 5803, 5804, 5805, 5806, 5807, 5808, 581, 5820, 5821, 5822, 5823, 5824, 5825, 5826, 5827, 5828, 5829, 5831, 5832, 5833, 5834, 5835, 5836, 5837, 5838, 5839, 5840, 5841, 5842, 5843, 5844, 5845, 5846, 5848, 5849, 5850, 5851, 5852, 5853, 5854, 5855, 5857, 5858, 5859, 5861, 5862, 5863, 5864, 5865, 5872, 5873, 5874, 5875, 5882, 5883, 5901, 5902, 5903, 5904, 5905, 5906, 5907, 5908, 5909, 591, 5921, 5922, 5923, 5924, 5925, 5926, 5931, 5932, 5933, 5934, 5935, 5936, 5937, 5939, 5941, 5942, 5943, 5944, 5945, 5946, 5947, 5948, 5951, 5952, 5953, 5954, 5955, 5956, 5957, 5961, 5962, 5963, 5964, 5965, 5966, 5971, 5973, 5975, 5976, 5977, 5978, 6002, 6003, 6004, 6007, 6008, 6020, 6021, 6022, 6023, 6024, 6026, 6027, 6028, 6029, 6031, 6032, 6033, 6034, 6035, 6036, 6039, 6041, 6042, 6043, 6044, 6045, 6046, 6047, 6048, 6049, 6050, 6051, 6052, 6053, 6054, 6055, 6056, 6057, 6058, 6059, 6061, 6062, 6063, 6066, 6068, 6071, 6073, 6074, 6078, 6081, 6082, 6083, 6084, 6085, 6086, 6087, 6092, 6093, 6094, 6095, 6096, 6101, 6102, 6103, 6104, 6105, 6106, 6107, 6108, 6109, 611, 6120, 6122, 6123, 6124, 6126, 6127, 6128, 6129, 6130, 6131, 6132, 6133, 6134, 6135, 6136, 6138, 6139, 6142, 6144, 6145, 6146, 6147, 6150, 6151, 6152, 6154, 6155, 6157, 6158, 6159, 6161, 6162, 6163, 6164, 6165, 6166, 6167, 6171, 6172, 6173, 6174, 6175, 6181, 6182, 6183, 6184, 6185, 6186, 6187, 6188, 6190, 6192, 6195, 6196, 6198, 6201, 6202, 6203, 6204, 6205, 6206, 6207, 6209, 621, 6220, 6221, 6222, 6223, 6224, 6226, 6227, 6228, 6229, 6231, 6232, 6233, 6234, 6235, 6236, 6237, 6238, 6239, 6241, 6242, 6243, 6244, 6245, 6246, 6247, 6249, 6251, 6252, 6253, 6254, 6255, 6256, 6257, 6258, 6261, 6262, 6263, 6264, 6265, 6266, 6267, 6268, 6269, 6271, 6272, 6274, 6275, 6276, 6281, 6282, 6283, 6284, 6285, 6286, 6287, 6291, 6292, 6293, 6294, 6295, 6296, 6297, 6298, 6301, 6302, 6303, 6304, 6305, 6306, 6307, 6308, 631, 6321, 6322, 6323, 6324, 6325, 6326, 6327, 6328, 6329, 6331, 6332, 6333, 6334, 6335, 6336, 6337, 6338, 6339, 6340, 6341, 6342, 6343, 6344, 6345, 6346, 6347, 6348, 6349, 6351, 6352, 6353, 6355, 6356, 6357, 6358, 6359, 6361, 6362, 6363, 6364, 6371, 6372, 6373, 6374, 6375, 6381, 6382, 6383, 6384, 6385, 6386, 6387, 6391, 6392, 6393, 6394, 6395, 6396, 6397, 6398, 6400, 6401, 6402, 6403, 6404, 6405, 6406, 6407, 6408, 6409, 641, 6420, 6421, 6422, 6423, 6424, 6425, 6426, 6427, 6428, 6429, 6430, 6431, 6432, 6433, 6434, 6435, 6436, 6438, 6439, 6440, 6441, 6442, 6443, 6444, 6445, 6446, 6447, 6449, 6451, 6452, 6453, 6454, 6455, 6456, 6457, 6458, 6461, 6462, 6464, 6465, 6466, 6467, 6468, 6471, 6472, 6473, 6474, 6475, 6476, 6477, 6478, 6479, 6482, 6483, 6484, 6485, 6486, 6500, 6501, 6502, 6503, 6504, 6505, 6506, 6507, 6508, 6509, 651, 6522, 6523, 6524, 6525, 6526, 6527, 6531, 6532, 6533, 6534, 6535, 6536, 6541, 6542, 6543, 6544, 6545, 6550, 6551, 6552, 6553, 6554, 6555, 6556, 6557, 6558, 6559, 6561, 6562, 6563, 6564, 6565, 6566, 6567, 6568, 6569, 6571, 6572, 6573, 6574, 6575, 6578, 6580, 6581, 6582, 6583, 6584, 6585, 6586, 6587, 6588, 6589, 6591, 6592, 6593, 6594, 6595, 6596, 6597, 6599, 661, 6620, 6621, 6622, 6623, 6624, 6625, 6626, 6627, 6628, 6629, 6630, 6631, 6633, 6634, 6635, 6636, 6637, 6638, 6639, 6641, 6642, 6643, 6644, 6645, 6646, 6647, 6648, 6650, 6651, 6652, 6653, 6654, 6655, 6656, 6657, 6658, 6659, 6660, 6661, 6663, 6664, 6665, 6666, 6667, 6668, 6669, 6670, 6672, 6673, 6674, 6675, 6676, 6677, 6678, 6681, 6682, 6683, 6684, 6691, 6692, 6693, 6694, 6695, 6696, 6697, 6698, 6701, 6703, 6704, 6706, 6707, 6708, 6709, 671, 6721, 6722, 6723, 6724, 6725, 6726, 6727, 6728, 6731, 6732, 6733, 6734, 6735, 6736, 6737, 6741, 6742, 6743, 6744, 6745, 6746, 6747, 6751, 6752, 6753, 6754, 6755, 6756, 6757, 6758, 6761, 6762, 6763, 6764, 6765, 6766, 6771, 6772, 6773, 6774, 6775, 6776, 6781, 6782, 6783, 6784, 6785, 6786, 6787, 6788, 6789, 6802, 6803, 6804, 6805, 6806, 6809, 681, 6821, 6824, 6825, 6826, 6827, 6831, 6832, 6833, 6834, 6835, 6836, 6837, 6838, 6841, 6842, 6843, 6844, 6848, 6849, 6851, 6852, 6853, 6854, 6855, 6856, 6857, 6858, 6861, 6864, 6865, 6866, 6867, 6868, 6869, 6871, 6872, 6873, 6874, 6875, 6876, 6881, 6887, 6888, 6893, 6894, 6897, 6898, 69, 7021, 7022, 7023, 7024, 7025, 7026, 7031, 7032, 7033, 7034, 7041, 7042, 7043, 7044, 7045, 7046, 7051, 7052, 7053, 7054, 7055, 7056, 7062, 7063, 7066, 7071, 7072, 7073, 7081, 7082, 7083, 7084, 7085, 711, 7121, 7122, 7123, 7124, 7125, 7126, 7127, 7128, 7129, 7130, 7131, 7132, 7133, 7134, 7135, 7136, 7138, 7139, 7141, 7142, 7143, 7144, 7145, 7146, 7147, 7148, 7150, 7151, 7152, 7153, 7154, 7156, 7157, 7158, 7159, 7161, 7162, 7163, 7164, 7165, 7166, 7171, 7172, 7173, 7174, 7175, 7176, 7181, 7182, 7183, 7184, 7191, 7192, 7193, 7194, 7195, 7202, 7203, 7204, 721, 7220, 7221, 7222, 7223, 7224, 7225, 7226, 7227, 7228, 7229, 7231, 7232, 7233, 7234, 7235, 7236, 7237, 7240, 7242, 7243, 7244, 7245, 7246, 7247, 7248, 7249, 7250, 7251, 7252, 7253, 7254, 7255, 7256, 7257, 7258, 7259, 7260, 7261, 7262, 7263, 7264, 7265, 7266, 7267, 7268, 7269, 7271, 7272, 7273, 7274, 7275, 7276, 7277, 7300, 7302, 7303, 7304, 7305, 7306, 7307, 7308, 7309, 731, 7321, 7322, 7323, 7324, 7325, 7326, 7327, 7328, 7329, 7331, 7332, 7333, 7334, 7335, 7336, 7337, 7340, 7343, 7344, 7345, 7346, 7347, 7348, 7351, 7352, 7353, 7354, 7355, 7356, 7357, 7358, 7361, 7362, 7363, 7364, 7365, 7366, 7367, 7371, 7373, 7374, 7375, 7376, 7381, 7382, 7383, 7384, 7385, 7386, 7387, 7388, 7389, 7391, 7392, 7393, 7394, 7395, 7402, 7403, 7404, 741, 7420, 7422, 7423, 7424, 7425, 7426, 7427, 7428, 7429, 7431, 7432, 7433, 7434, 7435, 7436, 7440, 7441, 7442, 7443, 7444, 7445, 7446, 7447, 7448, 7449, 7451, 7452, 7453, 7454, 7455, 7456, 7457, 7458, 7459, 7461, 7462, 7463, 7464, 7465, 7466, 7467, 7471, 7472, 7473, 7474, 7475, 7476, 7477, 7478, 7482, 7483, 7484, 7485, 7486, 7502, 7503, 7504, 7505, 7506, 751, 7520, 7522, 7524, 7525, 7527, 7528, 7529, 7531, 7532, 7533, 7534, 7541, 7542, 7543, 7544, 7545, 7546, 7551, 7552, 7553, 7554, 7555, 7556, 7557, 7558, 7561, 7562, 7563, 7564, 7565, 7566, 7567, 7568, 7569, 7570, 7571, 7572, 7573, 7574, 7575, 7576, 7577, 7578, 7579, 7581, 7582, 7583, 7584, 7585, 7586, 7587, 7602, 761, 7620, 7621, 7622, 7623, 7624, 7625, 7626, 7627, 7628, 7629, 7631, 7632, 7633, 7634, 7635, 7636, 7641, 7642, 7643, 7644, 7645, 7646, 7651, 7652, 7653, 7654, 7655, 7656, 7657, 7660, 7661, 7662, 7663, 7664, 7665, 7666, 7667, 7668, 7669, 7671, 7672, 7673, 7674, 7675, 7676, 7681, 7682, 7683, 7684, 7685, 7702, 7703, 7704, 7705, 7706, 7707, 7708, 7709, 771, 7720, 7721, 7722, 7723, 7724, 7725, 7726, 7727, 7728, 7729, 7731, 7732, 7733, 7734, 7735, 7736, 7738, 7739, 7741, 7742, 7743, 7744, 7745, 7746, 7747, 7748, 7751, 7753, 7754, 7755, 7761, 7762, 7763, 7764, 7765, 7771, 7773, 7774, 7775, 7777, 7802, 7803, 7804, 7805, 7806, 7807, 7808, 781, 7821, 7822, 7823, 7824, 7825, 7826, 7831, 7832, 7833, 7834, 7835, 7836, 7837, 7838, 7839, 7841, 7842, 7843, 7844, 7851, 7852, 7853, 7854, 7903, 7904, 7905, 7906, 7907, 791, 7930, 7931, 7932, 7933, 7934, 7935, 7936, 7937, 7938, 7939, 7940, 7941, 7942, 7943, 7944, 7945, 7946, 7947, 7948, 7949, 7950, 7951, 7952, 7953, 7954, 7955, 7957, 7958, 7959, 7961, 7962, 7963, 7964, 7965, 7966, 7967, 7971, 7972, 7973, 7974, 7975, 7976, 7977, 8020, 8021, 8022, 8023, 8024, 8025, 8026, 8027, 8028, 8029, 8031, 8032, 8033, 8034, 8035, 8036, 8038, 8039, 8041, 8042, 8043, 8045, 8046, 8051, 8052, 8053, 8054, 8055, 8056, 8057, 8061, 8062, 8063, 8064, 8065, 8066, 8067, 8071, 8072, 8073, 8074, 8075, 8076, 8081, 8082, 8083, 8084, 8085, 8086, 8091, 8092, 8093, 8094, 8095, 8102, 8104, 8105, 8106, 811, 8121, 8122, 8123, 8124, 8131, 8133, 8134, 8135, 8136, 8137, 8138, 8139, 8141, 8142, 8143, 8144, 8145, 8146, 8151, 8152, 8153, 8157, 8158, 8161, 8165, 8166, 8167, 8168, 8170, 8171, 8176, 8177, 8178, 8179, 8191, 8192, 8193, 8194, 8195, 8196, 8202, 8203, 8204, 8205, 8206, 8207, 8208, 821, 8221, 8222, 8223, 8224, 8225, 8226, 8230, 8231, 8232, 8233, 8234, 8236, 8237, 8238, 8239, 8241, 8243, 8245, 8246, 8247, 8248, 8249, 8250, 8251, 8252, 8253, 8254, 8257, 8258, 8259, 8261, 8262, 8263, 8265, 8266, 8267, 8268, 8269, 8271, 8272, 8273, 8274, 8276, 8281, 8282, 8283, 8284, 8285, 8291, 8292, 8293, 8294, 8295, 8296, 8302, 8303, 8304, 8306, 831, 8320, 8321, 8322, 8323, 8324, 8325, 8326, 8327, 8328, 8330, 8331, 8332, 8333, 8334, 8335, 8336, 8337, 8338, 8340, 8341, 8342, 8343, 8344, 8345, 8346, 8347, 8348, 8349, 8361, 8362, 8363, 8364, 8365, 8366, 8367, 8368, 8369, 8370, 8372, 8373, 8374, 8375, 8376, 8377, 8378, 8379, 8380, 8381, 8382, 8383, 8384, 8385, 8386, 8387, 8388, 8389, 8392, 8393, 8394, 8395, 8402, 8403, 8404, 8405, 8406, 8407, 841, 8421, 8422, 8423, 8424, 8426, 8427, 8431, 8432, 8433, 8434, 8435, 8441, 8442, 8443, 8444, 8445, 8446, 8450, 8452, 8453, 8454, 8456, 8457, 8458, 8459, 8460, 8461, 8462, 8463, 8464, 8465, 8466, 8467, 8468, 8469, 8501, 8502, 8503, 8504, 8505, 8506, 8507, 8509, 851, 8531, 8532, 8533, 8534, 8535, 8536, 8537, 8538, 8541, 8542, 8543, 8544, 8545, 8546, 8547, 8548, 8549, 8550, 8551, 8552, 8553, 8554, 8555, 8556, 8557, 8558, 8561, 8562, 8563, 8564, 8565, 8571, 8572, 8573, 8574, 8581, 8582, 8583, 8584, 8585, 8586, 8591, 8592, 8593, 861, 8621, 8622, 8623, 8624, 8628, 8629, 8630, 8631, 8633, 8634, 8635, 8636, 8637, 8638, 8639, 8640, 8641, 8642, 8649, 8650, 8651, 8652, 8654, 8656, 8657, 8661, 8662, 8663, 8664, 8665, 8666, 8667, 8669, 8670, 8671, 8677, 8678, 8679, 8681, 8682, 8683, 8684, 8685, 8686, 8687, 8702, 8703, 8704, 8705, 8706, 8707, 8708, 8709, 871, 8721, 8722, 8723, 8724, 8725, 8726, 8727, 8728, 8731, 8732, 8733, 8734, 8735, 8741, 8742, 8743, 8744, 8745, 8751, 8752, 8753, 8754, 8756, 8761, 8762, 8764, 8765, 8766, 8771, 8772, 8773, 8774, 8781, 8782, 8783, 8784, 8785, 8801, 8802, 8803, 8805, 8806, 8807, 8808, 8809, 881, 8821, 8822, 8823, 8824, 8825, 8841, 8845, 8846, 8847, 8851, 8856, 8857, 8858, 8860, 8861, 8862, 8867, 8868, 8869, 89, 906, 9070, 9071, 9072, 9073, 9074, 9075, 9076, 9077, 9078, 9080, 9081, 9082, 9083, 9084, 9085, 9086, 9087, 9088, 9089, 9090, 9091, 9092, 9093, 9094, 9097, 9099, 9101, 9102, 9103, 9104, 9105, 9106, 9107, 911, 9120, 9122, 9123, 9126, 9127, 9128, 9129, 9131, 9132, 9133, 9134, 9135, 9141, 9142, 9143, 9144, 9145, 9146, 9147, 9148, 9149, 9151, 9152, 9153, 9154, 9155, 9156, 9157, 9158, 9161, 9162, 9163, 9164, 9165, 9166, 9167, 9170, 9171, 9172, 9173, 9174, 9175, 9176, 9177, 9178, 9179, 9180, 9181, 9182, 9183, 9184, 9185, 9186, 9187, 9188, 9189, 9190, 9191, 9192, 9193, 9194, 9195, 9196, 9197, 9198, 9199, 9201, 9202, 9203, 9204, 9205, 9206, 9207, 9208, 9209, 921, 9220, 9221, 9222, 9223, 9225, 9227, 9228, 9229, 9231, 9232, 9233, 9234, 9235, 9236, 9238, 9241, 9242, 9243, 9244, 9245, 9246, 9251, 9252, 9253, 9254, 9255, 9256, 9257, 9260, 9261, 9262, 9263, 9264, 9265, 9266, 9267, 9268, 9269, 9270, 9271, 9272, 9273, 9274, 9275, 9276, 9277, 9278, 9279, 9280, 9281, 9282, 9283, 9284, 9285, 9286, 9287, 9288, 9289, 9292, 9293, 9294, 9295, 9302, 9303, 9305, 9306, 9307, 931, 9321, 9323, 9324, 9325, 9326, 9331, 9332, 9333, 9334, 9335, 9336, 9337, 9338, 9339, 9340, 9341, 9342, 9343, 9344, 9345, 9346, 9347, 9348, 9349, 9350, 9351, 9352, 9353, 9354, 9355, 9356, 9357, 9358, 9359, 9360, 9363, 9364, 9365, 9366, 9367, 9369, 9371, 9372, 9373, 9374, 9375, 9376, 9377, 9378, 9381, 9382, 9383, 9384, 9385, 9386, 9391, 9392, 9393, 9394, 9395, 9396, 9397, 9398, 9401, 9402, 9403, 9404, 9405, 9406, 9407, 9408, 9409, 941, 9420, 9421, 9422, 9423, 9424, 9426, 9427, 9428, 9429, 9431, 9433, 9434, 9435, 9436, 9438, 9439, 9441, 9442, 9443, 9444, 9445, 9446, 9447, 9448, 9451, 9452, 9453, 9454, 9461, 9462, 9463, 9464, 9465, 9466, 9467, 9468, 9469, 9471, 9472, 9473, 9474, 9480, 9481, 9482, 9484, 9491, 9492, 9493, 9495, 9497, 9498, 9499, 9502, 9503, 9504, 9505, 951, 9521, 9522, 9523, 9524, 9525, 9526, 9527, 9528, 9529, 9531, 9532, 9533, 9534, 9535, 9536, 9542, 9543, 9544, 9545, 9546, 9547, 9548, 9549, 9551, 9552, 9553, 9554, 9555, 9556, 9560, 9561, 9562, 9563, 9564, 9565, 9566, 9567, 9568, 9569, 9571, 9572, 9573, 9574, 9575, 9576, 9602, 9603, 9604, 9605, 9606, 9607, 9608, 961, 9621, 9622, 9624, 9625, 9626, 9627, 9628, 9631, 9632, 9633, 9634, 9635, 9636, 9637, 9638, 9639, 9641, 9642, 9643, 9644, 9645, 9646, 9647, 9648, 9651, 9652, 9653, 9654, 9655, 9656, 9657, 9658, 9659, 9661, 9662, 9663, 9664, 9665, 9666, 9671, 9672, 9673, 9674, 9675, 9676, 9677, 9681, 9682, 9683, 9701, 9704, 9708, 971, 9720, 9721, 9722, 9723, 9724, 9725, 9726, 9727, 9728, 9729, 9732, 9733, 9734, 9735, 9736, 9737, 9738, 9741, 9742, 9744, 9745, 9746, 9747, 9748, 9749, 9761, 9762, 9763, 9764, 9765, 9766, 9771, 9772, 9773, 9774, 9775, 9776, 9777, 9778, 9779, 9802, 9803, 9804, 9805, 981, 9820, 9822, 9823, 9824, 9825, 9826, 9827, 9828, 9829, 9831, 9832, 9833, 9834, 9835, 9836, 9837, 9841, 9842, 9843, 9844, 9845, 9846, 9847, 9848, 9851, 9852, 9853, 9854, 9855, 9856, 9857, 9861, 9865, 9867, 9868, 9869, 9871, 9872, 9873, 9874, 9875, 9876, 9901, 9903, 9904, 9905, 9906, 9907, 9908, 991, 9920, 9921, 9922, 9923, 9924, 9925, 9926, 9927, 9928, 9929, 9931, 9932, 9933, 9935, 9936, 9937, 9938, 9941, 9942, 9943, 9944, 9945, 9946, 9947, 9948, 9951, 9952, 9953, 9954, 9955, 9956, 9961, 9962, 9963, 9964, 9965, 9966, 9971, 9972, 9973, 9974, 9975, 9976, 9977, 9978],
  EntryPoints: [null, null, null, null, null, null, null, null, null, null], // Ortsnetzkennzahlen starting with 0,1,2,3,...
  Init: function () {
    for (var i = 0; i < DE.Ortsnetzkennzahlen.length; i++) {
      var Ortsnetzkennzahl = DE.Ortsnetzkennzahlen[i].toString();
      var FirstDigit = Number(Ortsnetzkennzahl.charAt(0));
      if (DE.EntryPoints[FirstDigit] == null) DE.EntryPoints[FirstDigit] = i;
    }
  },
  Check: function (num) {
    // Allen deutschen Netzvorwahlen für Mobilfunk ist gemeinsam, dass sie sich aus der nationalen Verkehrsausscheidungsziffer 0,
    // der Netzkennung 15/16/17 sowie der ein- bis zweistelligen Blockkennung zusammensetzen.
    // (Bei der Netzkennung 15 ist die Blockkennung zweistellig, ansonsten einstellig.)
    if (num.startsWith("15")) return 4;
    if (num.startsWith("16")) return 3;
    if (num.startsWith("17")) return 3;
    for (var i = 0; i < DE.Sonderdienste.length; i++) {
      var ac = DE.Sonderdienste[i].toString();
      if (num.startsWith(ac)) return ac.length;
    }
    var FirstDigit = Number(num.charAt(0));
    var EntryPoint = DE.EntryPoints[FirstDigit];
    if (EntryPoint != null) {
      for (var i = EntryPoint; i < DE.Ortsnetzkennzahlen.length; i++) {
        var ac = DE.Ortsnetzkennzahlen[i].toString();
        if (num.startsWith(ac)) return ac.length;
      }
    }
    return 0;
  },
}
DE.Init();

function PrettyPrintE164(num) {
  if (num) {
    var info = this.ParseE164(num);
    if (info.cc && info.ac && info.num) {
      return "+" + info.cc + " " + info.ac + " " + info.num;
    }
  }
  return num;
}

function normalizeE164(num) {
  var ar = num.split(/[ \(\)\-\/.:;\r\n\u2000-\u206F]/); // split by decoration characters (space,brackets,dash,slash,dot,colon,semicolon,carriagereturn,linefeed,generalpunctuation)
  while (ar.remove("")) ; // remove zero-length parts
  num = ar.join(""); // rebuilt number string without decoration characters
  // find and remove "Deppen-Null"
  if (num.charAt(0) == "+") {
    var info = this.ParseE164(num);
    if (info.cc && info.cc != "39" && info.cc != "242") {
      var offset = info.cc.length + 1;
      if (num.charAt(offset) == "0") {
        num = num.slice(0, offset) + num.slice(offset + 1, num.length);
      }
    }
  }
  return num;
}

function isE164(string) {
  for (var i = 0; i < string.length; i++) {
    if ('0' <= string[i] && string[i] <= '9') continue;
    if (string[i] == '*' || string[i] == '#') continue;
    if (string[i] == '+' && i == 0) continue;
    if (string[i] == ',' && i != 0) continue; // separated dialing digits from dtmf digits
    return false;
  }
  return true;
}

function isEmailAddress(text) {
  return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(text);
}

function FilterPhonenumber(text) {
  var result = "";
  for (var i = 0; i < text.length; i++) {
    var c = text.charAt(i);
    if ('0' <= c && c <= '9') result += c;
    else if (c == '+') result = "+";
  }
  return result;
}

function ParseE164(num) {
  var info = {cc: null, ac: null, num: null};
  if (num && (num.charAt(0) == '+' || num.charAt(0) == 'I')) {
    var ccLen = CheckCountryCode(num.substr(1));
    if (ccLen) {
      info.cc = num.substr(1, ccLen);
      info.num = num.substr(1 + ccLen);
      if (info.cc == "49") {
        var acLen = DE.Check(num.substr(3));
        if (acLen) {
          info.ac = num.substr(3, acLen);
          info.num = num.substr(3 + acLen);
        }
      }
    }
  }
  return info;
}


function AddExternalLinePrefix(num, dialingLocation) {
  if (!dialingLocation) return num;

  // dialingLocation: "000", "00", "0"
  // dialingLocation: "900", "90", "9"

  var prefixIntl = dialingLocation.prefixIntl || "",
    prefixNtl = dialingLocation.prefixNtl || "",
    prefixSubs = dialingLocation.prefixSubs || "";

  if (num.startsWith("+")) {
    // fully qualified international number
    return num;
  }
  if (prefixIntl.length && num.startsWith(prefixIntl)) {
    // international number with external line prefix
    return num;
  }

  if (prefixIntl.length && prefixSubs.length && prefixIntl.startsWith(prefixSubs)) {
    prefixIntl = prefixIntl.substr(prefixSubs.length);
  }

  if (prefixNtl.length && prefixSubs.length && prefixNtl.startsWith(prefixSubs)) {
    prefixNtl = prefixNtl.substr(prefixSubs.length);
  }

  if (prefixIntl.length && num.startsWith(prefixIntl)) {
    // international number without external line prefix
    // national number with external line prefix
    return prefixSubs + num;
  } else if (prefixNtl.length && num.startsWith(prefixNtl)) {
    // national number without external line prefix
    // subscriber number with external line prefix
    return prefixSubs + num;
  } else if (num.length >= 7) {
    // subscriber number without external line prefix
    return prefixSubs + num;
  }
  return num;
}
