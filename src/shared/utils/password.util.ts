import * as bcrypt from 'bcrypt';
export class PasswordUtil {
  static async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async compare(hashed: string, string: string): Promise<boolean> {
    return await bcrypt.compare(string, hashed);
  }

  static generate(length: number): string {
    return Math.random()
      .toString(36)
      .substring(2, length + 2);
  }
}
