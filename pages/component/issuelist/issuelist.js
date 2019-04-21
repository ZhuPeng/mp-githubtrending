Component({
  properties: {
    list: {
      type: Array,
      value: [],
      observer() {
        this.handleList();
      }
    },
  },

  data: {

  },

  methods: {
    handleList: function () {
      var tmp = this.data.list
      tmp.sort(function (a, b) {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
      this.setData({list: tmp})
    }
  }
})
