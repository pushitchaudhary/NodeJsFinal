module.exports = (sequelize, DataTypes) => {
    const mobile = sequelize.define("mobileDetails", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull:false
      }
    });
    return mobile;
  };
  