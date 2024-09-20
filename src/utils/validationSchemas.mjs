export const createUserValidationSchema = {
    "username":{
        isLength: {
            options: {
                min: 5,
                max: 32,
            },
            errorMessage: "Enter username b/w 5-32 characters",
        },
        notEmpty: {
            errorMessage: "Username cannot be Empty",
        },
        isString: {
            errorMessage: "username must be a string",
        }
    },

    "displayname": {
        notEmpty: true,
    },
    
    "password":{
        notEmpty: true,
    },
};