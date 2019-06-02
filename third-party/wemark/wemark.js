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
      currentDir: {
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
        images: {},
        imagesList: [],
		    richTextNodes: []
    },
    methods: {
      imageLoad(e) {
        var width = e.detail.width,   
          height = e.detail.height
        var images = this.data.images
        var url = e.target.dataset.text
        if (url in images) { return }
        if (this.isFaceImg(url)) {
          images[url] = { width: width/1.8, height: height/1.8 }
        } else if (width < 200 && height < 200) {
          images[url] = { width: width * 2, height: height * 2 }
        } else {return}
        this.setData({images: images})
      },
      isFaceImg(url) {
        if (url.startsWith('https://www.webfx.com/')) { return true }
        return false
      },
        onImgTap(e) {
          var url = e.target.dataset.text
          if (this.isFaceImg(url)) {return}
          console.log('previewImage:', url)
          wx.previewImage({
            current: url, 
            urls: this.data.imagesList, 
            complete: function(e) {console.log('complete:', e)},
            fail: function(e) {console.log('previewImage fail:', e)},
          })
        },
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
				var [parsedData, imagesList] = parser.parse(this.data.md, {
					link: this.data.link,
          baseurl: this.data.baseurl,
          currentDir: this.data.currentDir,
					highlight: this.data.highlight
				});
        var tmpList = []
        imagesList.map(i => {
          if (!this.isFaceImg(i)) {tmpList.push(i)}
        })
				// console.log('parsedData:', parsedData, imagesList);
				if(this.data.type === 'wemark'){
					this.setData({
						parsedData,
            imagesList: tmpList,
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
