import dotenv from 'dotenv'
dotenv.config()

export interface Config {
	port: number
	host: string
	cors: {
		origin: string
		allowedHeaders: string[]
	}
}

export const config: Config = {
	port: Number(process.env.PORT) || 3000,
	host: process.env.HOST || '0.0.0.0',
	cors: {
		origin: process.env.CORS_ORIGIN || '*',
		allowedHeaders: ['Authorization', 'Content-Type'],
	},
}
