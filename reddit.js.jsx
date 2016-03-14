var Story = React.createClass({
  render: function() {

    var _this = this;
    var t = function() {
      return {
        __html: $('<div />').html(_this.props.story.media_embed.content).text()
      };
    }

    return (
      <div className="row" key={this.props.story.url}>
        <div className="col-xs-1">
          {this.props.story.score}
        </div>
        <div className="col-xs-11">
          <a href={this.props.story.url}>
            {this.props.story.title}
          </a>
          <br/>
          {this.props.story.author}
          <div dangerouslySetInnerHTML={t()} />
        </div>
      </div>
    );
  },
})

var StoryList = React.createClass({
  render: function() {
    var storyNodes = this.props.stories.map(function(story) {
      return <Story story={story.data} />;
    });

    return (
      <div className="container">
        {storyNodes}
      </div>
    );
  },
});

var App = React.createClass({
  getInitialState: function() {
    return ({
      url: "",
      stories: [],
    });
  },
  setSelectedItem: function(item) {
    var _this = this;
    var url = "https://www.reddit.com/" + item.data.url + ".json";

    $.ajax({
      url: url,
      dataType: "json",
      data: {
          format: "json"
      },
      success: function( response ) {
        _this.setState({stories: response.data.children});
      }
    });

    this.setState({
      url: item.data.url,
    });
  },
  componentDidMount: function() {
    this.setSelectedItem({
      data: {
        url: "/r/all",
      }
    })
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
