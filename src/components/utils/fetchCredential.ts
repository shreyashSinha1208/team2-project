import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface UserData {
  institution: any;
  userId: string;
  username: string;
  name: string;
  role: string;
  batch: Array<string>;
  hasChangedPasswordOnce?: boolean;
}

interface DecodedToken {
  userData: UserData;
  // Include other properties if necessary
}

function getDecodedToken(): DecodedToken | null {
  if (typeof window === "undefined") {
    return null; // Return null if not in browser environment
  }

  const token = Cookies.get("jwt");
  if (!token) {
    console.error("Token not found in cookies");
    return null;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    return null;
  }
}

const decodedProxy = new Proxy({} as DecodedToken, {
  get(target, prop) {
    const decoded = getDecodedToken();
    if (!decoded) return undefined;
    return decoded[prop as keyof DecodedToken];
  },
});

export default decodedProxy;
