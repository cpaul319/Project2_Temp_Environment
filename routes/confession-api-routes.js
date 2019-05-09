var db = require("../models");

module.exports = function(app) {
  app.get("/api/confession", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.Confession.findAll({
      include: [db.Post]
    }).then(function(dbConfession) {
      res.json(dbConfession);
    });
  });

  app.get("/api/confession/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.Confession.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Post]
    }).then(function(dbConfession) {
      res.json(dbConfession);
    });
  });

  app.post("/api/confession", function(req, res) {
    db.Confession.create(req.body).then(function(dbConfession) {
      res.json(dbConfession);
    });
  });

  app.delete("/api/confession/:id", function(req, res) {
    db.Confession.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbConfession) {
      res.json(dbConfession);
    });
  });
  app.put("/api/confessions", function(req, res) {
    db.Confession.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbConfession) {
      res.json(dbConfession);
    });
  });

};
