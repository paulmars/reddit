var Story = React.createClass({
  render: function() {

    // console.log(this.props.story.preview.images[0].source.url);
    // console.log(this.props.story.preview.images[0]);

    try {
      var imageTag = (
        <img src={this.props.story.preview.images[0].source.url} width="500" />
      )
    }
    catch (e) {
      var imageTag = ""
    }

    var _this = this;
    var t = function() {
      return {
        __html: $('<div />').html(_this.props.story.media_embed.content).text()
      };
    }

    return (
      <div className="row" key={this.props.story.name}>
        <div className="col-xs-1">
          {this.props.story.score}
        </div>
        <div className="col-xs-11">
          <a href={this.props.story.url}>
            {this.props.story.title}
          </a>
          <br/>
          {this.props.story.author}
          <div>
            {this.props.story.name}
          </div>
          <div dangerouslySetInnerHTML={t()} />
          <div>
            { imageTag }
          </div>
        </div>
      </div>
    );
  },
})

var StoryList = React.createClass({
  render: function() {
    // console.log("this.props.stories");
    // console.log(this.props.stories);
    var indexNumber = 0;
    var storyNodes = _.map(this.props.stories, function(story) {
      indexNumber += 1;
      return <Story story={story.data} indexNumber={indexNumber} />;
    });

    return (
      <div className="container">
        {storyNodes}
      </div>
    );
  },
});

window.onscroll = function(ev) {
  // console.log("on scroll");
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2000) {
    // console.log("bottom");
    $('body').trigger('bottom');
  }
};

var App = React.createClass({
  getInitialState: function() {
    return ({
      url: "",
      stories: [],
    });
  },
  loadMore: function(location) {
    var _this = this;
    // console.log(location);
    var url = "https://www.reddit.com/" + location + ".json";

    if (this.state.stories.length > 0) {
      // console.log(this.state.stories);
      var storyLength = this.state.stories.length;
      var lastStory = this.state.stories[storyLength - 1];
      // console.log("lastStory");
      // console.log(lastStory);
      // var last_name = this.state[0].data.name;
      var last_name = lastStory.data.name;
      var url = "https://www.reddit.com/" + location + ".json?after=" + last_name;
    }

    // console.log("url");
    // console.log(url);

    $.ajax({
      url: url,
      dataType: "json",
      data: {
          format: "json"
      },
      success: function( response ) {
        // console.log("response");
        // console.log(_this.state.stories);
        // console.log(response);
        var stories = _this.state.stories.concat(response.data.children);
        console.log(stories);
        _this.setState({stories: stories});
      }
    });

    this.setState({
      url: location,
    });
  },
  componentDidMount: function() {
    var _this = this;
    $('body').on("bottom", function() {
      // console.log("found trigger");
      _this.loadMore("/r/awww");
    });
    window.loadMore = this.loadMore;
    this.loadMore("/r/awww");
  },
  render: function() {
    return (
      <StoryList stories={this.state.stories} />
    );
  },
});

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
