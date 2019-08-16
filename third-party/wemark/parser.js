var Remarkable = require('./remarkable');
var parser = new Remarkable({
	html: true
});
var prism = require('./prism');
var idDict = {}
var images = []

function urlModify(baseurl, url, currentDir) {
  var url = _urlModify(baseurl, url, currentDir)
  images.push(url)
  return url
}

function _urlModify(baseurl, url, currentDir) {
  var re = '/blob/master/'
  if (url.startsWith('https://github.com/') && url.indexOf(re)>0) {
    // 暂时以 /blob/master/ 作为替换标识
    return baseurl + url.slice(url.indexOf(re) + re.length, url.length)
  }
  if (url == "" || url == undefined || url.startsWith('http')) {
    return url
  }
  if (url.startsWith('./')) {url = url.replace('./', currentDir + '/')}
  return baseurl + url;
}

function isHtml(h) {
  var h = h.trim()
  h = h.replace(/^\s+|\s+$/g, '');  
  return h.startsWith('<') && h.endsWith('>')
}

function parse(md, options){
	if(!options) options = {};
	var tokens = parser.parse(md, {});

	// markdwon渲染列表
	var renderList = [];

	var env = [];
	// 记录当前list深度
	var listLevel = 0;
	// 记录第N级ol的顺序
	var orderNum = [0, 0];
	var tmp;
  var parseHtml = function(html, ret) {
    var list = [{ type: 'text', reg: /<a.*?>(.*?)<\/a>/g }, {type: 'image', reg: /<img.*?src\s*=\s*['"]*([^\s^'^"]+).*?(?:\/\s*|<\/img)?>/g}, {type: 'text', reg: /<h2.*?>(.*?)<\/h2>/g}, {type: 'text', reg: /<h1.*?>(.*?)<\/h1>/g}, {type: 'text', reg: /<p.*?>(.*?)<\/p>/g}, {type: 'text', reg: /<p.*?>(.*)/g}]
    var match;
    list.map(function(p) {
      var tmpHtml = html
      while (match = p.reg.exec(tmpHtml)) {
        // console.log('match: ', match)
        if (match[1]) {
          if (isHtml(match[1])) {
            var left = parseHtml(match[1], ret)
            match[1] = match[1].replace(match[1], left)
          }
          var data = { type: p.type, content: match[1]}
          if (p.type == 'image') {
            data['src'] = urlModify(options.baseurl, match[1], options.currentDir)
          }
          ret.push(data)
          html = html.replace(match[0], '')
        }
      }
    })
    if (html) {
      ret.push({ type: 'text', content: html })
    }
    return html
  }
	// 获取inline内容
	var getInlineContent = function(inlineToken){
		var ret = [];
		var env;
		var tokenData = {};
    if (inlineToken.type === 'htmlblock' || (inlineToken.type === 'inline' && isHtml(inlineToken.content))){
			// 匹配video
			// 兼容video[src]和video > source[src]
			var videoRegExp = /<video.*?src\s*=\s*['"]*([^\s^'^"]+).*?(poster\s*=\s*['"]*([^\s^'^"]+).*?)?(?:\/\s*>|<\/video>)/g;
            
	    var match;
	    var html = inlineToken.content.replace(/\n/g, '');
      parseHtml(html, ret)

			while(match = videoRegExp.exec(html)){
				if(match[1]){
					var retParam = {
						type: 'video',
						src: match[1]
					};

					if(match[3]) {
						retParam.poster = match[3];
					}

					ret.push(retParam);
				}
			}
		}else{
			inlineToken.children && inlineToken.children.forEach(function(token, index){
				if(['text', 'code'].indexOf(token.type) > -1){
					ret.push({
						type: env || token.type,
						content: token.content,
            id: idDict[token.content] || '',
						data: tokenData
					});
					env = '';
					tokenData = {};
				}else if(token.type === 'del_open'){
					env = 'deleted';
				}else if (token.type === 'softbreak') {
					// todo:处理li的问题
					/* ret.push({
						type: 'text',
						content: ' '
					}); */
				}else if (token.type === 'hardbreak') {
					ret.push({
						type: 'text',
						content: '\n'
					});
				}else if(token.type === 'strong_open'){
					if(env === 'em') {
						env = 'strong_em';
					}else {
						env = 'strong';
					}
				}else if (token.type === 'em_open') {
					if(env === 'strong') {
						env = 'strong_em';
					}else {
						env = 'em';
					}
				}else if (token.type === 'link_open') {
					if(options.link){
						env = 'link';
						tokenData = {
							href: token.href
						};
            if (token.href.startsWith('#')) {
              // console.log("link:", token, token.href, inlineToken.children[index + 1].content)
              idDict[inlineToken.children[index+1].content] = token.href.substr(1)
            }
					}
				}else if(token.type === 'image'){
					ret.push({
						type: token.type,
            src: urlModify(options.baseurl, token.src, options.currentDir)
					});
				}
			});
		}

		return ret;
	};

	var getBlockContent = function(blockToken, index, firstInLi){

		if(blockToken.type === 'htmlblock'){
			return getInlineContent(blockToken);
		}else if(blockToken.type === 'heading_open'){
			return {
				type: 'h' + blockToken.hLevel,
				content: getInlineContent(tokens[index+1])
			};
		}else if(blockToken.type === 'paragraph_open'){
			// var type = 'p';
			var prefix = '';
			if(env.length){
				prefix = env.join('_') + '_';
			}

			var content = getInlineContent(tokens[index+1]);

			// 处理ol前的数字
			if(env[env.length - 1] === 'li' && env[env.length - 2] === 'ol'){
				let prefix = '　';
				if (firstInLi){
					prefix = orderNum[listLevel - 1] + '. ';
				}
				content.unshift({
					type:'text',
					content: prefix
				});
			}

			return {
				type: prefix + 'p',
				content: content
			};
		}else if(blockToken.type === 'fence' || blockToken.type === 'code'){
			content = blockToken.content;
			var highlight = false;
            if (!blockToken.params){blockToken.params = 'python'}
            if (blockToken.params == 'c' || blockToken.params == 'c++' || blockToken.params == 'c#') {
                blockToken.params = 'clike'
            }
			if(options.highlight && blockToken.params && prism.languages[blockToken.params]){
				content = prism.tokenize(content, prism.languages[blockToken.params]);
				highlight = true;
			}

            const flattenTokens = (tokensArr, result = [], parentType = '') => {
                if (Array.isArray(tokensArr)) {
                    tokensArr.forEach(el => {
                        if (typeof el === 'object') {
                            // el.type = parentType + ' wemark_inline_code_' + el.type;
                            if(Array.isArray(el.content)){
                                flattenTokens(el.content, result, el.type);
                            }else{
                                flattenTokens(el, result, el.type);
                            }
                        } else {
                            const obj = {};
                            obj.type = parentType || 'text';
                            // obj.type = parentType + ' wemark_inline_code_';
                            obj.content = el;
                            result.push(obj);
                        }
                    })
                    return result
                } else {
                    result.push(tokensArr)
                    return result
                }
            }

            if(highlight){
                var tokenList = content;
                content = [];
                tokenList.forEach((token) => {
                    // let contentListForToken = [];
                    if(Array.isArray(token.content)){
                        content = content.concat(flattenTokens(token.content, [], ''));
                    }else{
                        content.push(token);
                    }
                });
            }
            // flatten nested tokens in html
            // if (blockToken.params === 'html') {
            // content = flattenTokens(content)
            // }
            // console.log(content);

			return {
				type: 'code',
				highlight: highlight,
				content: content
			};
		}else if(blockToken.type === 'bullet_list_open'){
			env.push('ul');
			listLevel++;
		}else if(blockToken.type === 'ordered_list_open'){
			env.push('ol');
			listLevel++;
		}else if(blockToken.type === 'list_item_open'){
			env.push('li');
			if(env[env.length - 2] === 'ol' ){
				orderNum[listLevel - 1]++;
			}
		}else if(blockToken.type === 'list_item_close'){
			env.pop();
		}else if(blockToken.type === 'bullet_list_close'){
			env.pop();
			listLevel--;
		}else if(blockToken.type === 'ordered_list_close'){
			env.pop();
			listLevel--;
			orderNum[listLevel] = 0;
		}else if(blockToken.type === 'blockquote_open'){
			env.push('blockquote');
		}else if(blockToken.type === 'blockquote_close'){
			env.pop();
		}else if(blockToken.type === 'tr_open'){
			tmp = {
				type: 'table_tr',
        content: []
			};
			return tmp;
		}else if(blockToken.type === 'th_open'){
			tmp.content.push({
				type: 'table_th',
				content: getInlineContent(tokens[index+1])
			});
		}else if(blockToken.type === 'td_open'){
			tmp.content.push({
				type: 'table_td',
				content: getInlineContent(tokens[index+1])
			});
		}
	};

	tokens.forEach(function(token, index){
		// 标记是否刚进入li，如果刚进入，可以加符号/序号，否则不加
		var firstInLi = false;
		if(token.type === 'paragraph_open' && tokens[index-1] && tokens[index-1].type === 'list_item_open'){
			firstInLi = true;
		}
		var blockContent = getBlockContent(token, index, firstInLi);
		if(!blockContent) return;
		if(!Array.isArray(blockContent)){
			blockContent = [blockContent];
		}
		blockContent.forEach(function(block){
			if(Array.isArray(block.content)){
				block.isArray = true;
			}else{
				block.isArray = false;
			}
			renderList.push(block);
		});
	});

	return [renderList, images];
}

module.exports = {
	parse: parse
};
