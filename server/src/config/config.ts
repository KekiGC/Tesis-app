export default {
    jwtSecret: process.env.JWT_SECRET || 'somesecrettoken',

    DB: {
        URI: process.env.MONGODB_URI || 'mongodb+srv://eduardoeg002:wrmwVSnU7HtoqI15@cluster0.mlkibxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        USER: process.env.MONGODB_USER,
        PASSWORD:process.env.MONGODB_PASSWORD
    }
}