import jwt from "jsonwebtoken";

export const authenticateUser = async (user) => {
  const accessToken = await generateJWTToken({
    _id: user._id,
 
  });
  return accessToken;
};

export const generateJWTToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "2 weeks" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    )
  );

export const verifyJWTToken = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) rej(err);
      else res(payload);
    })
  );
