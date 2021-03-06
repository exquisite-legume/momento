//requirements
var Sequelize = require('sequelize');
// var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/epilog';
var sequelize = new Sequelize('epilog',
  process.env.POSTGRES_ENV_POSTGRES_USER || null,
  process.env.POSTGRES_ENV_POSTGRES_PASSWORD || null,
  {
    dialect: 'postgres',
    host: process.env.DATABASE_URL || 'localhost',
    logging: false,
  });

//individual tables in database
var User = sequelize.define('users', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: Sequelize.STRING, field: 'first_name', notNull: true },
  lastName: { type: Sequelize.STRING, field: 'last_name', notNull: true },
  email: { type: Sequelize.STRING, notNull: true, unique: true },
  token: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING, notNull: true }
}, {timestamps: false });

var Story = sequelize.define('stories', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
    title: {
      type: Sequelize.STRING,
      notNull: true
  },
    description: {
      type: Sequelize.STRING,
      notNull: true
    },
  createdAt: {type: Sequelize.BIGINT, notNull: true}, // ms since epoc UTC
  updatedAt: {type: Sequelize.BIGINT, notNull: true}, // ms since epoc UTC
}, { timestamps: false });

var Moment = sequelize.define('moments', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  url: { type: Sequelize.STRING, notNull: true },
  caption: { type: Sequelize.STRING, notNull: true },
  updatedAt: {type: Sequelize.BIGINT, notNull: true}, // ms since epoc UTC
  createdAt: {type: Sequelize.BIGINT, notNull: true}, // ms since epoc UTC
}, { timestamps: false });

var Tag = sequelize.define('tags', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, notNull: true }
}, {timestamps: false })

var Comment = sequelize.define('comments', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: Sequelize.STRING, notNull: true },
  createdAt: {type: Sequelize.BIGINT, notNull: true}, // ms since epoc UTC
}, {timestamps: false })

//join tables
var Moments_Stories = sequelize.define('moments_stories', {});


var Users_Stories = sequelize.define('users_stories', {});

var Tags_Moments = sequelize.define('tags_moments', {});

var init = function (){
  //define relationship between moments and stories (M <-> M)
  Moment.belongsToMany(Story, { through: Moments_Stories});
  Story.belongsToMany(Moment, { through: Moments_Stories});

  //define relationship between users and moments (1 -> M)
  Moment.belongsTo(User, {foreignKey: 'userid'});
  User.hasMany(Moment, {foreignKey: 'userid'});

  //define relationship between stories and users (M <-> M)
  User.belongsToMany(Story, { through: Users_Stories});
  Story.belongsToMany(User, { through: Users_Stories});

  //define relationship between moments and comments (1 -> M)
  Comment.belongsTo(Moment);
  Moment.hasMany(Comment);

  //define relationship between users and comments (1 -> M)
  Comment.belongsTo(User);
  User.hasMany(Comment);

  //define relationship between tags and moments (M <-> M)
  Tag.belongsToMany(Moment, { through: Tags_Moments});
  Moment.belongsToMany(Tag, { through: Tags_Moments});

  //build out all tables
  // calling this is also required for the nice association methods to work
  return sequelize.sync()
}
module.exports = {
  sequelize: sequelize,
  User: User,
  Story: Story,
  Moment: Moment,
  Tag: Tag,
  Comment: Comment,
  Moments_Stories: Moments_Stories,
  Users_Stories: Users_Stories,
  Tags_Moments: Tags_Moments,
  init: init,
};
