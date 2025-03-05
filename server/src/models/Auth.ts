class Auth {
    public static GetToken(userId: string): string {
        return "valid-token";
    }

    public static ValidateToken(userId: string, token: string): boolean {
        if (userId) {
            return token === 'valid-token';
        }
        return false;
    }

    public static RefreshToken(userId: string): string {
        return "valid-token";
    }
}

export default Auth;