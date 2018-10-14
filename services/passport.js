const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/user");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require("bcrypt");
const keys = require("../Config/keys");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      console.log("In local stratrgy");
      let user = await userModel.findOne({ email });

      const validPassword = await bcrypt.compare(password, user.hashedPassword);

      if (!validPassword) {
        return done(null, false, { message: "Incorrect E-mail or password" });
      }
      return done(null, user, { message: "Logged In Successfully" });
    }
  )
);

passport.use(
  "verifyToken",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret"
    },
    function(jwtPayload, done) {
      console.log(jwtPayload);
      //find the user in db if needed. This functionality may be omitted
      //if you store everything you'll need in JWT payload.
      return userModel
        .findById({ _id: jwtPayload._id })
        .then(user => {
          return done(null, user);
        })
        .catch(err => {
          return done(err);
        });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);

      userModel.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          //Becasue existingUser can be Null
          //We already have a record with the given profileID
          done(null, existingUser);
        } else {
          //We dont't have a record with the given profileID
          //Model instance and passing required schema properties
          new userModel({ googleId: profile.id })
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);
