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
		return (
			<div className="commentList">
				<Comment author="Peter">this is one comment</Comment>
				<Comment author="Zdf">this is zdf comment</Comment>
			</div>
		);
	}
});

ReactDOM.render(
	<CommentList />,
	document.getElementById('content')
);