// ORM:
const { DataTypes } = require('sequelize');
const database = require('#services/db.service');

// Password hasher.
const bcryptSevice = require('#services/bcrypt.service');


const User = database.define(
	'User',
	{
		email: {
			type: DataTypes.STRING(255),
			unique: true,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		roleId: {
			type: DataTypes.INTEGER,
			required: true,
			allowNull: false
		},
		phone: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		photo: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	},
	{
		// Enable automatic 'createdAt' and 'updatedAt' fields.
		timestamps: true,
		// Only allow 'soft delete'
		// (set of 'deletedAt' field, insted of the real deletion).
		paranoid: true
	}
);

// Hooks:
User.beforeValidate((user, options) => {
	// Hash user's password.
	if (user.password)
		user.password = bcryptSevice.hashPassword(user);
})
// Hooks\

// Static methods:
User.associate = (models) => {
	models.User.hasMany(models.DisabledRefreshToken, {
		foreignKey: "UserId",
		as: 'disabledRefreshTokens'
	});
	models.User.belongsTo(models.Role, {
		foreignKey: "roleId",
		as: 'role'
	});
}

User.findById = function (id) {
	return this.findByPk(id);
}

User.findOneByEmail = function (email) {
	const query = {
		where: {
			email
		}
	};
	return this.findOne(query);
}
// Static methods\

// Instance methods:
User.prototype.toJSON = function () {
	const values = { ...this.get() };
	delete values.password;
	values.photo = process.env.BASE_URL + '/' + values.photo;
	return values;
}
// Instance methods\

module.exports = User;
