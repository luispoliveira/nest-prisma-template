export class ApiKeyUtil {
  static generateApiKey() {
    return (
      Math.random().toString(16).substring(2, 15) +
      Math.random().toString(16).substring(2, 15)
    );
  }

  static encode(key: string) {
    return btoa(key);
  }

  static decode(key: string) {
    return atob(key);
  }
}
