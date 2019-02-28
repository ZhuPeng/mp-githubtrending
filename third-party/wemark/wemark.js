const parser = require('./parser');
const getRichTextNodes = require('./richtext').getRichTextNodes;

Component({
    properties: {
        md: {
            type: String,
            value: '',
            observer(){
                this.parseMd();
            }
        },
		type: {
			type: String,
			value: 'wemark'
		},
        baseurl: {
           type: String,
           value: ''
        },
		link: {
			type: Boolean,
			value: false
		},
		highlight: {
			type: Boolean,
			value: false
		}
    },
    data: {
        parsedData: {},
		richTextNodes: []
    },
    methods: {
        onTap(e) {
            var clickurl = e.target.dataset.text
            if(clickurl.startsWith('#')) {
              console.log("onTap url:", clickurl)
              var query = this.createSelectorQuery()
              query.select(clickurl).boundingClientRect()
              query.selectViewport().scrollOffset()
              query.exec(function (res) {
                if (res.length < 2) {return}
                if (res[0] == null) {return}
                wx.pageScrollTo({
                  scrollTop: (res[0].top||0) + res[1].scrollTop,
                  duration: 300
                })
              })
            } else {
              this.triggerEvent('click', e)   
            }
        },
      
        parseMd(){
			if (this.data.md) {
				var parsedData = parser.parse(this.data.md, {
					link: this.data.link,
                    baseurl: this.data.baseurl,
					highlight: this.data.highlight
				});
				// console.log('parsedData:', parsedData);
				if(this.data.type === 'wemark'){
					this.setData({
						parsedData
					});
				}else{
					// var inTable = false;
					var richTextNodes = getRichTextNodes(parsedData);

					// console.log('richTextNodes:', richTextNodes);

					this.setData({
						richTextNodes
					});

					/* // 分批更新
					var update = {};
					var batchLength = 1000;
					console.log(batchLength);
					for(var i=0; i<richTextNodes.length; i++){
						update['richTextNodes.' + i] = richTextNodes[i];
						if(i%batchLength === batchLength - 1){
							console.log(update);
							this.setData(update);
							update = {};
						}
					}
					this.setData(update);
					update = {}; */
				}

            }
        }
    }
});
