process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../../app');
var Task = require('../../models/taskModel');

var should = chai.should();
chai.use(chaiHttp);


describe ('Task', function() {
  var createdDate;
  var dueDate;
  var newTaskId;

  Task.collection.drop();

  beforeEach(function (done) {
    var newTask = new Task({
      title: 'Feed the dinosaur',
      created: createdDate = new Date(),
      dueDate: dueDate = new Date(2016, 02, 26),
      importance: 3
    });
    newTask.save(function (err) {
      done();
    });
  });

  beforeEach(function (done) {
    var anotherNewTask = new Task({
      title: 'Pet the dinosaur',
      created: createdDate = new Date(),
      dueDate: dueDate = new Date(2016, 02, 26),
      importance: 2
    });
    anotherNewTask.save(function (err) {
      anotherNewTaskId = anotherNewTask.id;
      done();
    });
  });

  afterEach(function (done) {
    Task.collection.drop();
    done();
  });

  it ('responds with a json including a list of all tasks when there is a GET request to "/tasks"', function(done) {
    chai.request(server)
      .get('/tasks')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(2);
        res.body[0].title.should.equal('Feed the dinosaur');
        res.body[1].title.should.equal('Pet the dinosaur');
        done();
      });
  });

  it ('responds with JSON including the specified task when there is a GET request to "/tasks/:id" where id is the task', function(done){
    chai.request(server)
      .get('/tasks/' + anotherNewTaskId)
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.keys( ['_id', 'title', 'dueDate', 'importance', 'created', 'completed', '__v']);
        res.body.title.should.equal('Pet the dinosaur');
        res.body.created.should.equal(createdDate.toISOString());
        res.body.dueDate.should.equal(dueDate.toISOString());
        res.body.importance.should.equal(2);
        res.body.completed.should.equal(false);
        done();
      });
  });

});
