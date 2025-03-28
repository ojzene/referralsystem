module.exports = {
    apps : [
        {
          name: "billonapp",
          script: "dist/index.js",
          watch: true,
          env: {
            "PORT": 3003,
            "NODE_ENV": "development",
            "ENVIRONMENT": "development",
            "APP_URL": "http://localhost:3003",
            "APP_URL_REMOTE": "https://billonapp.azurewebsites.net",
            "BASE_PATH": "https://billonapp.azurewebsites.net",
            "BILLON_BASE_URL": "https://billonapp.azurewebsites.net",
            "BASE_PATH_DEV": "https://billlonn.netlify.app",
            "BASE_PATH_STAGING": "https://billonapp.azurewebsites.net",
            "DB_NAME": "billondb",
            "DB_USER": "root",
            "DB_PASSWORD": "",
            "DB_HOST": "localhost",
            "JWT_SECRET": "somesuperbillonkey",
            "AWS_ACCESS_KEY": "",
            "AWS_ACCESS_KEY_ID": "",
            "S3_REGION": "",
            "S3_BUCKET": "",
            "EMAIL_ADDRESS": "",
            "EMAIL_USERNAME": "",
            "EMAIL_PASSWORD": "",
            "OKRA_TOKEN": "",
            "SMTP_USERNAME": "",
            "SMTP_PASSWORD": "",
            "GOOGLE_CLIENT_URL": "1050060297577-cmjrj8344ocafvccg695v2hvt8se4pe4.apps.googleusercontent.com",
            "GOOGLE_CLIENT_ID": "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",
            "GOOGLE_API_KEY": "AIzaSyCv7_oPItOYYUHfWjnJP0g_roRIuYgBRS8",
            "SENDGRID_API_KEY": "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",
            "TWILIO_ACCOUNTSID": "AC1aebf83b608938295596a7186670c120",
            "TWILIO_AUTHTOKEN": "c9d950b787d17cf18d1fe89e055e508a",
            "TWILIO_VERIFYSID": "VA8ef58c41db42e65ad899e78f42309587",
            "MONGO_LOCAL": "mongodb://127.0.0.1:27017/pocketpointsdb",
            "MONGO_PROD": "mongodb+srv://pocketpoint:pocketpoint2025@cluster0.a4j9b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/pocketpointsdb",
            "COOKIE_KEY": "any_long_and_random_string",
            "MINIMUM_ONBOARDING_POINT": 100
          },
          env_test: {
            "PORT": 8080,
            "NODE_ENV": "production",
            "ENVIRONMENT": "production",
            "APP_URL": "http://localhost:3003",
            "APP_URL_REMOTE": "https://billonapp.azurewebsites.net",
            "BASE_PATH": "https://billonapp.azurewebsites.net",
            "BILLON_BASE_URL": "https://billonapp.azurewebsites.net",
            "BASE_PATH_DEV": "https://billlonn.netlify.app",
            "BASE_PATH_STAGING": "https://billonapp.azurewebsites.net",
            "DB_NAME": "billondb",
            "DB_USER": "root",
            "DB_PASSWORD": "",
            "DB_HOST": "localhost",
            "JWT_SECRET": "somesuperbillonkey",
            "AWS_ACCESS_KEY": "",
            "AWS_ACCESS_KEY_ID": "",
            "S3_REGION": "",
            "S3_BUCKET": "",
            "EMAIL_ADDRESS": "",
            "EMAIL_USERNAME": "",
            "EMAIL_PASSWORD": "",
            "OKRA_TOKEN": "",
            "SMTP_USERNAME": "",
            "SMTP_PASSWORD": "",
            "GOOGLE_CLIENT_URL": "1050060297577-cmjrj8344ocafvccg695v2hvt8se4pe4.apps.googleusercontent.com",
            "GOOGLE_CLIENT_ID": "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",
            "GOOGLE_API_KEY": "AIzaSyCv7_oPItOYYUHfWjnJP0g_roRIuYgBRS8",
            "SENDGRID_API_KEY": "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",
            "TWILIO_ACCOUNTSID": "AC1aebf83b608938295596a7186670c120",
            "TWILIO_AUTHTOKEN": "c9d950b787d17cf18d1fe89e055e508a",
            "TWILIO_VERIFYSID": "VA8ef58c41db42e65ad899e78f42309587",
            "MONGO_LOCAL": "mongodb://127.0.0.1:27017/pocketpointsdb",
            "MONGO_PROD": "mongodb+srv://pocketpoint:pocketpoint2025@cluster0.a4j9b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/pocketpointsdb",
            "COOKIE_KEY": "any_long_and_random_string",
            "MINIMUM_ONBOARDING_POINT": 100
          },
          env_production: {
            "PORT": 3003,
            "NODE_ENV": "production",
            "ENVIRONMENT": "production",
            "APP_URL": "http://localhost:3003",
            "APP_URL_REMOTE": "https://billonapp.azurewebsites.net",
            "BASE_PATH": "https://billonapp.azurewebsites.net",
            "BILLON_BASE_URL": "https://billonapp.azurewebsites.net",
            "BASE_PATH_DEV": "https://billlonn.netlify.app",
            "BASE_PATH_STAGING": "https://billonapp.azurewebsites.net",
            "DB_NAME": "billondb",
            "DB_USER": "root",
            "DB_PASSWORD": "",
            "DB_HOST": "localhost",
            "JWT_SECRET": "somesuperbillonkey",
            "AWS_ACCESS_KEY": "",
            "AWS_ACCESS_KEY_ID": "",
            "S3_REGION": "",
            "S3_BUCKET": "",
            "EMAIL_ADDRESS": "",
            "EMAIL_USERNAME": "",
            "EMAIL_PASSWORD": "",
            "OKRA_TOKEN": "",
            "SMTP_USERNAME": "",
            "SMTP_PASSWORD": "",
            "GOOGLE_CLIENT_URL": "1050060297577-cmjrj8344ocafvccg695v2hvt8se4pe4.apps.googleusercontent.com",
            "GOOGLE_CLIENT_ID": "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",
            "GOOGLE_API_KEY": "AIzaSyCv7_oPItOYYUHfWjnJP0g_roRIuYgBRS8",
            "SENDGRID_API_KEY": "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",
            "TWILIO_ACCOUNTSID": "AC1aebf83b608938295596a7186670c120",
            "TWILIO_AUTHTOKEN": "c9d950b787d17cf18d1fe89e055e508a",
            "TWILIO_VERIFYSID": "VA8ef58c41db42e65ad899e78f42309587",
            "MONGO_LOCAL": "mongodb://127.0.0.1:27017/pocketpointsdb",
            "MONGO_PROD": "mongodb+srv://pocketpoint:pocketpoint2025@cluster0.a4j9b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/pocketpointsdb",
            "COOKIE_KEY": "any_long_and_random_string",
            "MINIMUM_ONBOARDING_POINT": 100
          },
          watch: 'false',
          ignore_watch : [ "*.log"],
        }
    ]
}