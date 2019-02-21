const cloudclient = require('../../utils/cloudclient.js')
const util = require('../../utils/util.js')
Page({
  data: {
    owner: '',
    view: {},
    info: '## GitHub Profile',
    repos: [],
    reposMd: '',
    languages: [],
    langDist: '',
    contrib: '',
    maxLanguages: 9,
    maxItems: 5,
    about: '## About This Resume\nThis resume is generated automatically using public information from the developer\'s GitHub account. The repositories are ordered by popularity based on a very simple popularity heuristic that defines the popularity of a repository by its sum of watchers and forks. This was a Wechat mini-program version, which inspired by [resume/resume.github.com](https://github.com/resume/resume.github.com).',
    spinning: false,
  },

  genReposMd: function(repos) {
    if (repos.length == 0) {return}
    var reposMd = '## Popular Repositories\n'
    var since, until, date, view, template, html;
    var self = this
    repos.map(function(repo, index){
      if (index >= self.data.maxItems) {
        return;
      }
      since = new Date(repo.info.created_at);
      since = since.getFullYear();
      until = new Date(repo.info.pushed_at);
      until = until.getFullYear();
      if (since == until) {
        date = since;
      } else {
        date = since + ' &ndash; ' + until;
      }
      var watchersLabel = repo.info.watchers == 0 || repo.info.watchers > 1 ? ' stars ' : ' star '
      var forksLabel = repo.info.forks == 0 || repo.info.forks > 1 ? ' forks ' : ' fork '

      reposMd += '* ' + util.mdLink(repo.info.name, repo.info.html_url) + '\n\n'
      reposMd += repo.info.language + ' ' + repo.info.watchers + watchersLabel + repo.info.forks + forksLabel + ' (' + date + ') ' + '\n\n' 
      reposMd += repo.info.description + '\n'
    })
    this.setData({reposMd})
  },

  genProfile: function genProfile() {
    var v = this.data.view;
    var info = '## GitHub Profile\n' + v.userStatus + '\n\n';
    info += 'On GitHub'
    if (v.earlyAdopter) {
      info += ' as an early adopter'
    }
    info += ' since ' +  v.since + ', ' + v.name + ' is a developer'
    if (v.location) {
      info += ' based in ' + v.location
    }
    if (v.repos) {
      info += ' with ' + util.mdLink(v.repos + ' public ' + v.reposLabel, 'https://github.com/' + v.username)
    } else {
      info += ' without any public repository for now'
    }
    if (v.followers) {
      info += ' and ' + util.mdLink(v.followers + ' ' + v.followersLabel, 'https://github.com/' + v.username + '?tab=followers');
    }
    info += '.'
    this.setData({info, spinning: false})
  },

  genLangDistMd: function (languages, languageTotal) {
    if (!languages || languages.length == 0) {
      return
    }
    var langDist = '## Languages\n'
    languages.map(function (lang){
        var percent = parseInt((lang.popularity / languageTotal) * 100);
        langDist += '* ' + lang.name + ' (' + percent + '%)\n';
    })
    this.setData({langDist})
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: 'GitHub Resume' })
    var self = this;
    this.setData({spinning: true, owner: options.name})
    this.getUser(options.name, function callback(data) {
      self.getView(options.name, data);
    })
    this.github_user_repos(options.name, this.githubLangsDist, 1, [])
    this.github_user_issues(options.name, this.handleIssues, 1, [])
  },

  handleIssues: function(username, data) {
    console.log('handleIssues: ', data)
    var contrib = '## Contributions\n'
    var self = this

    var sorted = [],
      repos = {};

    data.map(function (issue, i) {
      if (repos[issue.repository_url] === undefined) {
        repos[issue.repository_url] = { popularity: 1 }
      } else {
        repos[issue.repository_url].popularity += 1;
      }
    });
    for (var repo in repos) {
      var obj = repos[repo]
      sorted.push({ repo: repo, popularity: obj.popularity });
    }

    function sortByPopularity(a, b) {
      return b.popularity - a.popularity;
    };

    sorted.sort(sortByPopularity);
    if (sorted.length > 0) {
      var view, template, html, repoUrl, repoName, commitsUrl;
      sorted.map(function (repo, index) {
        repoUrl = repo.repo.replace(/https:\/\/api\.github\.com\/repos/, 'https://github.com');
        repoName = repo.repo.replace(/https:\/\/api\.github\.com\/repos\//, '');
        commitsUrl = repoUrl + '/commits?author=' + username;
        var link = util.mdLink(repoName, repoUrl)
        contrib += '* ' + link + '\n\n'
        contrib +=  username + ' has contributed for ' + link + ' with ' + util.mdLink(repo.popularity + ' commit(s)', commitsUrl)
        contrib += '\n'
      })
      self.setData({contrib})
    }
  },

  github_user_issues: function (username, callback, page_number, prev_data) {
    var page = (page_number ? page_number : 1),
      url = '/search/issues?q=' + encodeURIComponent('type:pr is:merged author:' + username + '') + '&per_page=100',
      data = (prev_data ? prev_data : []);
    url += '&page=' + page_number;
    var self = this
    console.log('url: ', url)
    cloudclient.callFunction({ type: 'get', path: url }, function (c) {
      data = data.concat(c.items)
      if (c.length == 100) {
        self.github_user_issues(username, callback, page + 1, data);
      } else {
        callback(username, data)
      }
    })
  },

  githubLangsDist: function (data) {
    var sorted = [],
      languages = {},
      popularity;

    data.map(function (repo, i) {
      if (repo.fork !== false) {
        return;
      }

      if (repo.language) {
        if (repo.language in languages) {
          languages[repo.language]++;
        } else {
          languages[repo.language] = 1;
        }
      }

      popularity = repo.watchers + repo.forks;
      sorted.push({ position: i, popularity: popularity, info: repo });
      
    });

    function sortByPopularity(a, b) {
      return b.popularity - a.popularity;
    };

    sorted.sort(sortByPopularity);
    this.setData({'repos': sorted})
    this.genReposMd(sorted)

    var languageTotal = 0;
    var self = this;
    function sortLanguages(languages, limit) {
      var sorted_languages = [];

      for (var lang in languages) {
        if (typeof (lang) !== "string") {
          continue;
        }
        sorted_languages.push({
          name: lang,
          popularity: languages[lang],
          toString: function () {
            return '<a href="https://github.com/search?q=user%3A'
              + self.data.view.username + '&l=' + encodeURIComponent(this.name) + '">'
              + this.name + '</a>';
          }
        });

        languageTotal += languages[lang];
      }

      if (limit) {
        sorted_languages = sorted_languages.slice(0, limit);
      }

      return sorted_languages.sort(sortByPopularity);
    }
    languages = sortLanguages(languages, this.data.maxLanguages);
    this.setData({languages})
    this.genLangDistMd(languages, languageTotal);
  },

  github_user_repos: function (username, callback, page_number, prev_data) {
    var page = (page_number ? page_number : 1),
      url = '/users/' + username + '/repos?per_page=100',
      data = (prev_data ? prev_data : []);

    if (page_number > 1) {
      url += '&page=' + page_number;
    }
    var self = this
    cloudclient.callFunction({ type: 'get', path: url }, function (c) {
      data = data.concat(c)
      if (c.length == 100) {
        self.github_user_repos(username, callback, page + 1, data);
      } else {
        callback(data)
      }
    })
  },

  getView: function (username, data) {
    var sinceDate = new Date(data.created_at);
    var sinceMonth = sinceDate.getMonth();
    var since = sinceDate.getFullYear();
    var sinceMonth = sinceDate.getMonth();
    var currentYear = (new Date).getFullYear();
    switch (since) {
      case currentYear - 1:
        since = 'last year';
        break;
      case currentYear:
        since = 'this year';
        break;
    }

    var addHttp = '';
    if (data.blog && data.blog.indexOf('http') < 0) {
      addHttp = 'http://';
    }

    // set view.name to the "friendly" name e.g. "John Doe". If not defined
    // (in which case data.name is empty), fall back to the login
    // name e.g. "johndoe"
    var name = username;
    if (data.name !== null && data.name !== undefined && data.name.length) {
      name = data.name;
    }

    var avatar = '';
    if (data.type == 'Organization') {
      // avatar handle temp remove
    }

    var view = {
      name: name,
      type: data.type,
      email: data.email,
      created_at: data.created_at,
      earlyAdopter: 0,
      location: data.location || '',
      gravatar_id: data.gravatar_id,
      avatar_url: avatar,
      repos: data.public_repos,
      reposLabel: data.public_repos > 1 ? 'repositories' : 'repository',
      followers: data.followers,
      followersLabel: data.followers > 1 ? 'followers' : 'follower',
      username: username,
      userStatus: 'GitHub user',
      since: since,
      resume_url: '',
    };

    // We consider a limit of 4 months since the GitHub opening (Feb 2008) to be considered as an early adopter
    if ((since == '2008' && sinceMonth <= 5) || since <= '2007') {
      view.earlyAdopter = 1;
    }

    view.userStatus = this.getUserStatus(view, data);
    this.setData({view: view});
    this.genProfile()
  },

  getUser: function getUser(owner, callback) {
    cloudclient.callFunction({ type: 'get', path: '/users/' + owner }, function (c) {
      callback(c)
    })
  },

  getUserStatus: function (view, data) {
    var COEF_REPOS = 2;
    var COEF_GISTS = 0.25;
    var COEF_FOLLOWERS = 0.5;
    var COEF_FOLLOWING = 0.25;
    var FIRST_STEP = 0;
    var SECOND_STEP = 5;
    var THIRD_STEP = 20;
    var FOURTH_STEP = 50;
    var FIFTH_STEP = 150;
    var EXTRA_POINT_GAIN = 1;

    var statusScore = data.public_repos * COEF_REPOS
      + data.public_gists * COEF_GISTS
      + data.followers * COEF_FOLLOWERS
      + data.following * COEF_FOLLOWING;

    // Extra points
    // - Early adopter
    if(view.earlyAdopter == 1) {
      statusScore += EXTRA_POINT_GAIN;
    }
    // - Blog & Email & Location
    if (view.location && view.location != '' && view.email && view.email != '' && data.blog && data.blog != '') {
      statusScore += EXTRA_POINT_GAIN;
    }

    if (statusScore == FIRST_STEP) {
      return 'Inactive GitHub user';
    } else if (statusScore > FIRST_STEP && statusScore <= SECOND_STEP) {
      return 'Newbie GitHub user';
    } else if (statusScore > SECOND_STEP && statusScore <= THIRD_STEP) {
      return 'Regular GitHub user';
    } else if (statusScore > THIRD_STEP && statusScore <= FOURTH_STEP) {
      return 'Advanced GitHub user';
    } else if (statusScore > FOURTH_STEP && statusScore <= FIFTH_STEP) {
      return 'Enthusiastic GitHub user';
    } else if (statusScore > FIFTH_STEP) {
      return 'Passionate GitHub user';
    }
  },

  onShareAppMessage: function () {

  }
})