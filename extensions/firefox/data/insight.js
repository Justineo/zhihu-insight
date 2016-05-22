(function () {
  if (!location.pathname.match(/\/question\/\d+$/)) {
    return;
  }

  function getState(key) {
    return JSON.parse(localStorage.getItem('zhins-' + key));
  }
  function setState(key, value) {
    return JSON.stringify(localStorage.setItem('zhins-' + key, value));
  }

  function getPageTop(elem) {
    let top = 0;
    do {
      top += elem.offsetTop;
      elem = elem.offsetParent;
    } while (elem);

    return top;
  }

  let fixedTop = getPageTop(document.querySelector('.zu-main-sidebar'));

  let root = document.getElementById('zhins');
  if (!root) {

    let styles =
`#zhins-switcher {
  margin-left: 10px;
}

#zhins-switcher .message {
  float: none;
  width: 22px;
  display: inline-block;
}

#zhins-switcher .icon {
  opacity: 1;
  height: 16px;
  margin: 0;
}

#zhins-switcher.zhins-active,
#zhins-fixed.zhins-active {
  background: #ddd;
  box-shadow: none;
}

#zhins-fixed {
  margin-top: -3px;
  margin-left: 5px;
  padding: 0 5px;
}

#zhins {
  display: none;
  margin-top: 15px;
  padding-right: 20px;
  background-color: #fff;
}

#zhins .zhins-list {
  list-style: none;
}

.zhins-fixed #zhins .zhins-list {
  overflow: auto;
  max-height: calc(100vh - ${fixedTop + 80}px);
}

#zhins a {
  display: block;
  text-decoration: none;
  color: #999;
}

.zhins-item {
  overflow: hidden;
  margin-bottom: 8px;
}

.zhins-votes {
  float: left;
  margin: 0 8px 0 0;
  width: 38px;
  height: 25px;
  border-radius: 3px;
  background-color: #eff6fa;
  color: #698ebf;
  font-weight: 500;
  line-height: 25px;
  text-align: center;
}

.zhins-author {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.zhins-item .zm-profile-header-icon {
  background-position: -160px -110px;
}

.zhins-item:hover .zhins-votes {
  background-color: #698ebf;
  color: #fff;
}

.zhins-item:hover .zhins-author {
  color: #222;
}

.zhins-external,
.zhins-anchor {
  display: block;
}

#zhins .zhins-external {
  position: relative;
  float: right;
  width: 25px;
  height: 25px;
  border-radius: 3px;
  background-color: #eff6fa;
}

#zhins .zhins-external::before {
  content: "";
  position: absolute;
  top: 6.5px;
  left: 13px;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-left-color: #698ebf;
}

#zhins .zhins-external::after {
  content: "";
  position: absolute;
  top: 9.5px;
  left: 7px;
  width: 6px;
  height: 6px;
  background-color: #698ebf;
}

#zhins .zhins-item .zhins-external:hover {
  background-color: #698ebf;
}

#zhins .zhins-item .zhins-external:hover::before {
  border-left-color: #fff;
}

#zhins .zhins-item .zhins-external:hover::after {
  background-color: #fff;
}

.zhins-avatar {
  float: left;
  width: 25px;
  height: 25px;
  margin-right: 8px;
  border-radius: 2px;
}

.zhins-detail {
  overflow: hidden;
  line-height: 1;
  max-width: 140px;
}

.zhins-meta {
  margin: 4px 0;
}

#zhins .zg-icon-comment-like {
  background-position: -222px -92px;
}

#zhins-more {
  display: block;
  margin-bottom: 10px;
  font-size: 13px;
}

.zhins-active #zhins {
  display: block;
}

.zhins-fixed .zu-main-sidebar {
  position: fixed;
  top: ${fixedTop}px;
  right: calc(50vw - 480px);
  bottom: 0;
}`;

    createStyles(styles);

    let switcherHTML =
`<div class="zm-noti7-popup-tab-item message">
  <div class="icon"></div>
</div>`;
    let switcher = document.createElement('div');
    switcher.id = 'zhins-switcher';
    switcher.className = 'zg-btn-white';
    switcher.dataset.tip = 's$r$切换回答索引';
    switcher.innerHTML = switcherHTML;
    let menu = document.getElementById('zh-question-operation-menu');
    menu.parentNode.insertBefore(switcher, menu.nextElementSibling);
    switcher.addEventListener('click', () => {
      setState('isActive', !getState('isActive'));
      updateState();
    });

    root = document.createElement('div');
    root.id = 'zhins';
    root.innerHTML = '<h3>回答索引 <div id="zhins-fixed" class="zg-btn-white" data-tip="s$r$切换固定"><i class="z-icon z-icon-pin"></i></div></h3><div class="zhins-list"></div>'
    document.getElementById('zh-question-side-header-wrap').insertBefore(root, document.querySelector('.zh-question-followers-sidebar'));
    document.getElementById('zhins-fixed').addEventListener('click', () => {
      setState('isFixed', !getState('isFixed'));
      updateState();
    });
    root.addEventListener('click', function () {
      let target = event.target;
      if (target.id === 'zhins-more') {
        target.classList.add('loading');
        target.innerHTML = '<i class="spinner-gray"></i> 加载中';
        document.querySelector('.zu-main-content .zu-button-more').dispatchEvent(new Event('click'));
      }
    })
  }

  updateState();

  function updateState() {
    let switcher = document.getElementById('zhins-switcher').classList;
    let fixed = document.getElementById('zhins-fixed').classList;
    let body = document.body.classList;

    if (getState('isActive')) {
      switcher.add('zhins-active');
      body.add('zhins-active');
    } else {
      switcher.remove('zhins-active');
      body.remove('zhins-active');
    }

    if (getState('isFixed')) {
      fixed.add('zhins-active');
      body.add('zhins-fixed');
      if (!getState('isActive')) {
        body.remove('zhins-fixed');
      }
    } else {
      fixed.remove('zhins-active');
      body.remove('zhins-fixed');
    }
  }

  function createStyles(styleText) {
    let style = document.createElement('style');
    style.type = 'text/css';
    document.head.appendChild(style);

    if (style.styleSheet) {
      style.styleSheet.cssText = styleText;
    }
    else {
      style.appendChild(document.createTextNode(styleText));
    }
  }

  let last;

  function extract() {
    last = document.querySelector('.zm-item-answer:last-child');
    let content = Array.from(document.querySelectorAll('.zm-item-answer')).map((elem, i) => {
      let authorLink = elem.querySelector('.author-link');

      let item = {
        href: elem.querySelector('link').getAttribute('href'),
        aid: elem.dataset.aid,
        token: elem.dataset.atoken,
        authorName: authorLink ? authorLink.textContent : '匿名用户',
        authorId: authorLink ? authorLink.getAttribute('href').replace('/people/', '') : null,
        avatar: authorLink ? elem.querySelector('.zm-list-avatar').src : null,
        votes: parseInt(elem.querySelector('.zm-item-vote-info').dataset.votecount, 10),
        comments: parseInt((elem.querySelector('.z-icon-comment').nextSibling.textContent.match(/\d+/) || ['0'])[0], 10)
      };

      let authorHTML = authorLink
        ? `<span data-tip="p$t$${item.authorId}">${item.authorName}</span>`
        : `<span>${item.authorName}</span>`

      let avatarHTML = item.avatar
        ? `<img class="zhins-avatar" src="${item.avatar}" data-tip="p$t$${item.authorId}">`
        : '';

      let html =
`<li class="zhins-item">
  <a class="zhins-external" href="${item.href}" target="_blank" data-tip="s$r$新页面打开"></a>
  <a class="zhins-anchor" href="#answer-${item.aid}">
    <div class="zhins-votes">${item.votes > 10000 ? Math.round(item.votes / 1000) + 'K' : item.votes}</div>
    ${avatarHTML}
    <div class="zhins-detail">
      <div class="zhins-author">${authorHTML}</div>
      <div class="zhins-meta"><i class="z-icon-comment"></i>${item.comments} </div>
    </div>
  </a>
</li>`;

      return html;
    }).join('\n');

    let more = document.querySelector('.zu-main-content .zu-button-more');
    if (more) {
      content += '<div id="zhins-more" class="zg-btn-white">更多</div>';
    } else {
      let indexMore = document.getElementById('zhins-more');
      if (indexMore) {
        indexMore.parentNode.removeChild(indexMore);
      }
    }

    root.querySelector('.zhins-list').innerHTML = content;
  }

  let observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      let added = mutation.addedNodes[0];
      if (added && added.previousElementSibling === last) {
        let indexMore = document.getElementById('zhins-more');
        if (indexMore) {
          indexMore.classList.remove('loading');
          indexMore.innerHTML = '更多';
        }
        extract();
      }
      let removed = mutation.removedNodes[0];
      if (removed && removed.nodeType === 1 && removed.classList.contains('.zu-button-more')) {
        let indexMore = document.getElementById('zhins-more');
        if (indexMore) {
          indexMore.parentNode.removeChild(indexMore);
        }
      }
    });
  });
  let observeConfig = {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
  };
  observer.observe(document.querySelector('.zu-main-content-inner'), observeConfig);

  extract();
})();
