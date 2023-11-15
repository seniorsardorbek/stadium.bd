import { Injectable } from "@nestjs/common";

@Injectable()
export class SessionService {
  private readonly sessions: Map<string, any> = new Map();

  // Create a new session and return the session token
  createSession(user: any): string {
    const sessionToken = this.generateSessionToken();
    this.sessions.set(sessionToken, user);
    return sessionToken;
  }

  // Check if a session is valid
  async isValidSession(sessionToken: string): Promise<boolean> {
    // In a real-world application, you would perform checks here, such as
    // verifying the session token against a database or cache.
    return this.sessions.has(sessionToken);
  }

  // Get user information from a session
  async getUserFromSession(sessionToken: string): Promise<any | undefined> {
    // In a real-world application, you would fetch the user data associated
    // with the session token, e.g., from a database.
    return this.sessions.get(sessionToken);
  }

  // Generate a random session token (for demonstration purposes)
  private generateSessionToken(): string {
    const tokenLength = 36;
    const randomChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < tokenLength; i++) {
      token += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length),
      );
    }
    return token;
  }
}
