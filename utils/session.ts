

export const sessionOptions = {
    password: process.env.SESSION_SECRET,
    cookieName: "anon_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

declare module "iron-session" {
    interface IronSessionData {
        anonymousId?: string;
    }
}
