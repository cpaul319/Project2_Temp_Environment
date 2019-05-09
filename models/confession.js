module.exports = function(sequelize, DataTypes) {
  var Confession = sequelize.define("Confession", {
    // Giving the Confession model a name of type TEXT
    confession: DataTypes.TEXT,
    isItTrue: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  });

  Confession.associate = function(models) {
    // Associating Confession with Posts
    // When an Confession is deleted, also delete any associated Posts
    Confession.hasMany(models.Post, {
      onDelete: "cascade"
    });
  };
   

  return Confession;
};