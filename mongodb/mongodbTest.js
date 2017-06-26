/**
 * http://usejsdoc.org/
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://192.168.200.3:27017/mydb1';

MongoClient.connect(url,function(err,db){
	assert.equal(null,err);
	console.log("Connected correctly to server");
	
	db.collection('inserts').insertOne({a:1},function(err,r){
		assert.equal(null,err);
		assert.equal(1,r.insertedCount);
		
		db.collection('inserts').insertMany([{a:2},{a:3,b:1}],function(err,r){
			assert.equal(null,err);
			assert.equal(2,r.insertedCount);
			
			db.close();
		});
	});
	
});
/*
MongoClient.connect(url,function(err,db){
	assert.equal(null,err);
	
	db.collection('inserts').insertOne({
		a : 1,
		b : function(){return 'hello';},
	},{
		w : 'majority',
		wtimeout : 10000,
		serializeFunctions : true,
		forceServerObjectid : true
	},function(err,r){
		assert.equal(null,err);
		assert.equal(1,r.insertedCount);
		db.close();
	});
});

MongoClient.connect(url,function(err,db){
	assert.equal(null,err);
	
	var col = db.collection('updates');
	col.insertMany([{a:1},{a:2},{a:2}],function(err,r){
		assert.equal(null,err);
		assert.equal(3,r.insertedCount);
		
		col.updateOne({a:1},{$set:{b:1}},function(err,r){
			assert.equal(null,err);
			assert.equal(1,r.matchedCount);
			assert.equal(1,r.modifiedCount);
			
			col.updateMany({a:2},{$set:{b:2}},function(err,r){
				assert.equal(null,err);
				assert.equal(2,r.matchedCount);
				assert.equal(2,r.modifiedCount);
				
				col.updateOne({a:3},{$set:{b:1}},{upsert:true},function(err,r){
					assert.equal(null,err);
					assert.equal(1,r.matchedCount);
					assert.equal(1,r.upsertedCount);
					
					db.close();
				});
			});
		});
	});
});

MongoClient.connect(url,function(err,db){
	assert.equal(null,err);
	
	var col = db.collection('removes');
	
	col.insertMany([{a:1},{a:2},{a:2},{a:2}],function(err,r){
		assert.equal(null,err);
		assert.equal(4,r.insertedCount);
		
		col.deleteOne({a:2},function(err,r){
			assert.equal(null,err);
			assert.equal(1,r.deletedCount);
			
			col.deleteMany({a:2},function(err,r){
				assert.equal(null,err);
				assert.equal(2,r.deletedCount);
				db.close();
			});
		});
	});
});


MongoClient.connect(url,function(err,db){
	assert.equal(null,err);
	
	var col = db.collection('findAndModify');
	col.insert([{a:1},{a:2},{a:2}],function(err,r){
		assert.equal(null,err);
		assert.equal(3,r.result.n);
		
		col.findOneAndUpdate({a:1},{$set:{b:1}},{
			returnOriginal : false,
			sort : [['a',1]],
			upsert : true,
		},function(err,r){
			assert.equal(null,err);
			assert.equal(1,r.value.b);
			
			col.findOneAndDelete({a:2},function(err,r){
				assert.equal(null,err);
				assert.ok(r.value.b == null);
				db.close();
			});
		});
	});
});

MongoClient.connect(url,function(err,db){
	assert.equal(null,err);
	
	var col = db.collection('bulk_write');
	col.bulkWrite([{insertOne : {document : {a:1}}},
	               {updateOne : {filter : {a:2},update : {$set :{a:2}},upsert:true}},
	               {updateMany : {filter :{a:2},update : {$set :{a:2}},upsert:true}},
	               {deleteOne : {filter :{c:1}}},
	               {deleteMany : {filter :{c:1}}},
	               {replaceOne : {filter :{c:1},replacement : {c:4},upsert:true}}],{
		ordered : true,w:1
	 },function(err,r){
		 assert.equal(null,err);
		 assert.equal(1,r.insertedCount);
		 assert.equal(1,Object.keys(r.insertedIds).length);
		 assert.equal(1,r.matchedCount);
		 assert.equal(0,r.modifiedCount);
		 assert.equal(0,r.deletedCount);
		 assert.equal(2,r.upsertedCount);
		 assert.equal(2,Object.keys(r.upsertedIds).length);
		 
		 db.close();
	 });
});

MongoClient.connect(url,function(err,db){
	assert.equal(null,err);
	
	var col = db.collection('bulkops');
	
	var bulk = col.initializeOrderedBulkOp();
	
	for(var i=0;i<10;i++){
		bulk.insert({a:i});
	}
	
	for(var i=0;i<10;i++){
		bulk.find({b:i}).upsert().updateOne({b:1});
	}
	
	bulk.find({b:1}).deleteOne();
	
	bulk.execute(function(err,result){
		assert.equal(null,err);
		db.close();
	});
});

MongoClient.connect(url,function(err,db){
	assert.equal(null,err);
	
	var col = db.collection('find');
	
	col.insertMany([{a:1},{a:1},{a:1}],function(err,r){
		assert.equal(null,err);
		assert.equal(3,r.insertedCount);
		
		col.find({a:1}).limit(2).toArray(function(err,docs){
			assert.equal(null,err);
			assert.equal(2,docs.length);
		});
		
		col.find({a:1}).limit(2).next(function(err,doc){
			assert.equal(null,err);
			assert.ok(doc != null);
		});
		
		col.find({a:1}).limit(2).each(function(err,doc){
			if(doc){
				return false;
			}
		});
	});
});

*/