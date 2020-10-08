const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");
const { GraphQLError } = require("graphql");

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (error) {
        console.log(error);
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

      // const userByUsername = await User.findOne({ where: { username } });
      // const userByEmail = await User.findOne({ where: { email } });

      // if (userByUsername) errors.username = "Username is already taken";
      // if (userByEmail) errors.email = "Email is already taken";

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
    },
  },
};
