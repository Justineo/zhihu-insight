let data = require('sdk/self').data;
let pageMod = require('sdk/page-mod');

pageMod.PageMod({
  include: ['http://www.zhihu.com/*', 'https://www.zhihu.com/*'],
  contentScriptFile: [
    data.url('insight.js')
  ]
});
