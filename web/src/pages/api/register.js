import { isEmailValid, isAlreadyRegistered, registerUser } from "@/auth/index";
import { createCooikesFromTokens } from "@/auth/tokens-management";

export default async function Register({ method, body }, res) {
  try {
    if (method !== "POST") {
      return res.status(404).send("");
    }

    let { email = "", password = "" } = body;

    email = email.toLowerCase();

    if (!isEmailValid(email)) {
      throw new Error("Invalid email");
    }

    if (await isAlreadyRegistered(email)) {
      throw new Error("The user is already registered");
    }

    let { accessToken, refreshToken } = await registerUser(email, password);

    createCooikesFromTokens(res, { accessToken, refreshToken });

    return res.status(200).json({ accessToken });
  } catch ({ message = "unhandled error in registration steps" }) {
    return res.status(400).json({ message });
  }
}
