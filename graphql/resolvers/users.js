const { User } = require("../../models");
const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    getUsers: async (_, __, {user}) => {
      try {
        let user;
        if (!user)  throw new AuthenticationError("Unauthenticated")
        const users = await User.findAll({
          where: { username: { [Op.ne]: user.username } },
        });
        return users;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      let errors = {};
      try {
        if (username.trim() === "")
          errors.username = "Username must not be empty";
        if (password === "") errors.password = "Password must not be empty";

        if (Object.keys(errors).length > 0) {
          throw new UserInputError("Bad input", { errors });
        }

        const user = await User.findOne({ where: { username } });

        if (!user) {
          errors.username = "User not found!";
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          errors.password = "Incorrect password!";
          throw new UserInputError("Wrong password", { errors });
        }

        const token = jwt.sign(
          {
            username,
          },
          process.env.SECRET,
          { expiresIn: 60 * 60 }
        );

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    register: async (parent, args, context, info) => {
      let { username, email, password, confirmPassword } = args;
      let errors = {};

      if (email.trim() == "") errors.email = "Email field must not be empty";
      if (username.trim() == "")
        errors.username = "Username field must not be empty";
      if (password.trim() == "")
        errors.password = "Password field must not be empty";
      if (confirmPassword.trim() == "")
        errors.confirmPassword = "Confirm password field must not be empty";

      if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords must match";
      }

      if (Object.keys(errors).length > 0) {
        throw new GraphQLError(errors);
      }

      password = await bcrypt.hash(password, 6);

      try {
        const newUser = await User.create({
          username,
          email,
          password,
        });
        return newUser;
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          error.errors.forEach(
            (e) => (errors[e.path] = `${e.path.split(".")[1]} is already taken`)
          );
        } else if (error.name === "SequelizeValidationError") {
          error.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad input", { errors });
      }
    }
  },
};
