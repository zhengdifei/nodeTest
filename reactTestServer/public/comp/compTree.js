var treeData = [
{id:1,category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
{id:2,category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
{id:3,category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
{id:4,category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
{id:5,category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
{id:6,category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}];

var ProductRow = React.createClass({
	render : function(){
		return (
			<div>
				<span>{this.props.name}</span><span>{this.props.price}</span>
			</div>
		);
	}
});

var ProductCategoryRow = React.createClass({
	render : function(){
		var productRows = this.props.data.map(function(row){
			return (
				<ProductRow name={row.name} price={row.price} />
			);
		});
		return (
			<div>
				<span>{this.props.category}</span><br/>
				{productRows}
			</div>
		);
	}
});

var ProductTable = React.createClass({
	render : function(){
		var categoryMap = {};
		
		for(var i =0;i<this.props.data.length;i++){
			if(categoryMap[this.props.data[i]['category']] == null){
				categoryMap[this.props.data[i]['category']] = [];
				categoryMap[this.props.data[i]['category']].push(this.props.data[i]);
			}else{
				categoryMap[this.props.data[i]['category']].push(this.props.data[i]);
			}
		};
		
		var categoryRows = [];
		
		for(var key in categoryMap){
			categoryRows.push(<ProductCategoryRow category={key} data={categoryMap[key]} />);
		}
		
		return (
				<div>
					<span>name</span>
					<span>price</span>
					{categoryRows}
				</div>
		);
	}
});

var SearchBar = React.createClass({
	render:function(){
		return (
			<div>
				<input type="text" name="search" /><br/>
				<input type="checkbox" name="condition" value=""/>
				Only show products
			</div>
		);
	}
});

var FilterableProductTable = React.createClass({
	render : function(){
		return (
			<div>
				<SearchBar />
				<ProductTable data={this.props.data} />
			</div>
		);
	}
});
ReactDOM.render(
		<FilterableProductTable data={treeData} />,
		document.getElementById('content')
);