import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.resolve("config/.env")});
import express from 'express'
import { initApp } from './src/initApp.js';
const app = express()


initApp(app, express)