interface EnviromentConfig{
    API_URL: string;
}

const devConfig: EnviromentConfig = {
    API_URL: 'http://10.0.2.2:8080'
}
/*
const prodConfig: EnviromentConfig = {
    API_URL: 'https://api.example.com'
}*/

export const config = devConfig;