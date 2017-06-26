var Comment = React.createClass({
	rawMarkup : function(){
		var rawMarkup = marked(this.props.children.toString(),{sanitize : true});
		return {__html : rawMarkup};
	},
	render : function(){
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				<span dangerouslySetInnerHTML={this.rawMarkup()}/>
			</div>
		);
	}
});

var CommentList = React.createClass({
	render : function(){
		var commentNodes = this.props.data.map(function(comment){
			return (
				<Comment author={comment.author}>
					{comment.text}
				</Comment>
			);
		})
		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});

var CommentForm = React.createClass({
	render : function(){
		return (
			<div className="commentForm">
				Hello,world!I am a CommentForm.
			</div>
		);
	}
});

var CommentBox = React.createClass({
	render : function(){
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.props.data} />
				<CommentForm />
			</div>
		);
	}
});

var data = [{
    "key": 1388534400000,
    "author": "Pete Hunt",
    "text": "Hey there!"
},
{
    "key": 1420070400000,
    "author": "Paul O’Shannessy",
    "text": "React is *great*!"
},
{
    "key": 1457942468777,
    "author": "zdf",
    "text": "hello world"
    }
];

ReactDOM.render(
	<CommentBox data={data}/>,
	document.getElementById('content')
);