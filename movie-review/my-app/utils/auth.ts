import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  username: string;
}

export const getUsernameFromToken = (token: string): string | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.username || null;
  } catch (error) {
    console.error('토큰 디코딩 중 오류 발생:', error);
    return null;
  }
};